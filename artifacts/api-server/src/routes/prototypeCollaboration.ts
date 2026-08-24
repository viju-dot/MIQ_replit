import { Router, type IRouter } from "express";
import { Pool } from "pg";

const router: IRouter = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validBody(
  body: unknown,
  prototypeId: string,
  id: string,
): body is Record<string, unknown> {
  return (
    isRecord(body) &&
    body.id === id &&
    body.prototypeId === prototypeId
  );
}

router.get("/prototypes/:prototypeId/comments", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, prototype_id, version_id, data
         FROM prototype_comments
        WHERE prototype_id = $1
        ORDER BY created_at ASC`,
      [req.params.prototypeId],
    );
    res.json(
      result.rows.map((row) => ({
        ...row.data,
        id: row.id,
        prototypeId: row.prototype_id,
        versionId: row.version_id,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.put("/prototypes/:prototypeId/comments/:id", async (req, res, next) => {
  const { prototypeId, id } = req.params;
  if (!validBody(req.body, prototypeId, id)) {
    res.status(400).json({ error: "body id/prototypeId must match the route" });
    return;
  }
  try {
    await pool.query(
      `INSERT INTO prototype_comments
         (id, prototype_id, version_id, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, COALESCE($5::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET
         prototype_id = EXCLUDED.prototype_id,
         version_id = EXCLUDED.version_id,
         data = EXCLUDED.data,
         updated_at = NOW()`,
      [
        id,
        prototypeId,
        typeof req.body.versionId === "string" ? req.body.versionId : null,
        JSON.stringify(req.body),
        typeof req.body.createdAt === "string" ? req.body.createdAt : null,
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/prototypes/:prototypeId/comments/:id", async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM prototype_comments WHERE prototype_id = $1 AND id = $2",
      [req.params.prototypeId, req.params.id],
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get("/prototypes/:prototypeId/annotations", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, seq, prototype_id, version_id, status, data
         FROM prototype_annotations
        WHERE prototype_id = $1
        ORDER BY created_at ASC`,
      [req.params.prototypeId],
    );
    res.json(
      result.rows.map((row) => ({
        ...row.data,
        id: row.id,
        seq: row.seq,
        prototypeId: row.prototype_id,
        versionId: row.version_id,
        status: row.status,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.put("/prototypes/:prototypeId/annotations/:id", async (req, res, next) => {
  const { prototypeId, id } = req.params;
  if (!validBody(req.body, prototypeId, id)) {
    res.status(400).json({ error: "body id/prototypeId must match the route" });
    return;
  }
  try {
    const result = await pool.query(
      `WITH allocation_lock AS MATERIALIZED (
         SELECT pg_advisory_xact_lock(178622143, hashtext($2))
       ),
       next_sequence AS MATERIALIZED (
         SELECT COALESCE(MAX(annotation.seq), 0) + 1 AS seq
           FROM prototype_annotations AS annotation
           CROSS JOIN allocation_lock
          WHERE annotation.prototype_id = $2
       ),
       stored AS (
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
           updated_at = NOW()
         RETURNING id, seq, prototype_id, version_id, status, data
       )
       SELECT id, seq, prototype_id, version_id, status, data FROM stored`,
      [
        id,
        prototypeId,
        typeof req.body.versionId === "string" ? req.body.versionId : null,
        typeof req.body.status === "string" ? req.body.status : null,
        JSON.stringify(req.body),
        typeof req.body.createdAt === "string" ? req.body.createdAt : null,
      ],
    );
    const row = result.rows[0];
    res.json({
      ...row.data,
      id: row.id,
      seq: row.seq,
      prototypeId: row.prototype_id,
      versionId: row.version_id,
      status: row.status,
    });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/prototypes/:prototypeId/annotations/:id",
  async (req, res, next) => {
    try {
      await pool.query(
        "DELETE FROM prototype_annotations WHERE prototype_id = $1 AND id = $2",
        [req.params.prototypeId, req.params.id],
      );
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

export default router;