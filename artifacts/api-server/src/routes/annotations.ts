/**
 * Durable design-annotation mirror.
 *
 * The authoring client sends its current annotation list here so the
 * implementation workflow can inspect feedback without access to that
 * browser's localStorage. The mirror uses the same Postgres records as the
 * normal annotation API, so it survives API restarts and published sessions.
 */
import { Router, type IRouter } from "express";
import { Pool } from "pg";

const router: IRouter = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const MAX_BODY_BYTES = 64 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function canonicalAnnotation(row: {
  id: string;
  seq: number;
  prototype_id: string;
  version_id: string | null;
  status: string | null;
  data: Record<string, unknown>;
}) {
  return {
    ...row.data,
    id: row.id,
    seq: row.seq,
    prototypeId: row.prototype_id,
    versionId: row.version_id,
    status: row.status,
  };
}

async function listAnnotations(prototypeId: string) {
  const result = await pool.query(
    `SELECT id, seq, prototype_id, version_id, status, data
       FROM prototype_annotations
      WHERE prototype_id = $1
      ORDER BY created_at ASC`,
    [prototypeId],
  );
  return result.rows.map(canonicalAnnotation);
}

router.put("/annotation-mirror/:prototypeId", async (req, res, next) => {
  const len = Number(req.headers["content-length"] ?? 0);
  if (len > MAX_BODY_BYTES) {
    res.status(413).json({ error: "payload too large" });
    return;
  }

  const { annotations } = req.body ?? {};
  if (!Array.isArray(annotations)) {
    res.status(400).json({ error: "annotations must be an array" });
    return;
  }

  const prototypeId = req.params.prototypeId;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const annotation of annotations) {
      if (
        !isRecord(annotation) ||
        annotation.prototypeId !== prototypeId ||
        typeof annotation.id !== "string" ||
        annotation.id.length === 0
      ) {
        continue;
      }

      await client.query(
        `WITH allocation_lock AS MATERIALIZED (
           SELECT pg_advisory_xact_lock(178622143, hashtext($2))
         ),
         next_sequence AS MATERIALIZED (
           SELECT COALESCE(MAX(existing.seq), 0) + 1 AS seq
             FROM prototype_annotations AS existing
             CROSS JOIN allocation_lock
            WHERE existing.prototype_id = $2
         )
         INSERT INTO prototype_annotations
           (id, seq, prototype_id, version_id, status, data, created_at, updated_at)
         SELECT
           $1,
           next_sequence.seq,
           $2,
           $3,
           $4,
           jsonb_set($5::jsonb, '{seq}', to_jsonb(next_sequence.seq), true),
           COALESCE($6::timestamptz, NOW()),
           NOW()
         FROM next_sequence
         ON CONFLICT (id) DO UPDATE SET
           prototype_id = EXCLUDED.prototype_id,
           version_id = EXCLUDED.version_id,
           status = EXCLUDED.status,
           data = jsonb_set(
             EXCLUDED.data,
             '{seq}',
             to_jsonb(prototype_annotations.seq),
             true
           ),
           updated_at = NOW()`,
        [
          annotation.id,
          prototypeId,
          typeof annotation.versionId === "string" ? annotation.versionId : null,
          typeof annotation.status === "string" ? annotation.status : null,
          JSON.stringify(annotation),
          typeof annotation.createdAt === "string" ? annotation.createdAt : null,
        ],
      );
    }
    await client.query("COMMIT");
    res.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      annotations: await listAnnotations(prototypeId),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.get("/annotation-mirror/:prototypeId", async (req, res, next) => {
  try {
    const annotations = await listAnnotations(req.params.prototypeId);
    if (annotations.length === 0) {
      res.status(404).json({ error: "no annotations synced yet" });
      return;
    }
    res.json({
      updatedAt: new Date().toISOString(),
      annotations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;