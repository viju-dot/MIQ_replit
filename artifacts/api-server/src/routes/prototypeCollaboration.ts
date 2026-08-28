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

function canonicalComment(row: { id: string; prototype_id: string; version_id: string; data: Record<string, unknown> }) {
  return { ...row.data, id: row.id, prototypeId: row.prototype_id, versionId: row.version_id };
}

router.get("/prototypes/:prototypeId/comments", async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Durable, idempotent recovery for records created by the retired
    // soft-delete flow. Explicit open/resolved status always wins (notably,
    // reopening a legacy-resolved comment retains deletedAt as metadata).
    await client.query(
      `UPDATE prototype_comments
          SET data = jsonb_set(
            jsonb_set(data, '{status}', '"resolved"'::jsonb),
            '{resolvedAt}', COALESCE(data->'resolvedAt', data->'deletedAt')
          ),
          updated_at = NOW()
        WHERE prototype_id = $1
          AND jsonb_typeof(data->'deletedAt') = 'string'
          AND pg_input_is_valid(data->>'deletedAt', 'timestamp with time zone')
          AND COALESCE(data->>'status', '') NOT IN ('open', 'resolved')`,
      [req.params.prototypeId],
    );
    // Canonicalize untouched legacy comments as open as well. This makes every
    // persisted record use the explicit lifecycle without changing content.
    await client.query(
      `UPDATE prototype_comments
          SET data = jsonb_set(data, '{status}', '"open"'::jsonb),
              updated_at = NOW()
        WHERE prototype_id = $1
          AND NOT COALESCE(
            jsonb_typeof(data->'deletedAt') = 'string'
            AND pg_input_is_valid(data->>'deletedAt', 'timestamp with time zone'),
            FALSE
          )
          AND COALESCE(data->>'status', '') NOT IN ('open', 'resolved')`,
      [req.params.prototypeId],
    );
    const result = await client.query(
      `SELECT id, prototype_id, version_id, data
         FROM prototype_comments
        WHERE prototype_id = $1
        ORDER BY created_at ASC`,
      [req.params.prototypeId],
    );
    await client.query("COMMIT");
    res.json(
      result.rows.map(canonicalComment),
    );
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.put("/prototypes/:prototypeId/comments/:id", async (req, res, next) => {
  const { prototypeId, id } = req.params;
  if (!validBody(req.body, prototypeId, id)) {
    res.status(400).json({ error: "body id/prototypeId must match the route" });
    return;
  }
  try {
    const legacyDeletedAt =
      typeof req.body.deletedAt === "string" && !Number.isNaN(Date.parse(req.body.deletedAt))
        ? req.body.deletedAt
        : undefined;
    const status = req.body.status === "resolved" || legacyDeletedAt ? "resolved" : "open";
    const body = {
      ...req.body,
      status,
      ...(status === "resolved" && !req.body.resolvedAt && legacyDeletedAt
        ? { resolvedAt: legacyDeletedAt }
        : {}),
    };
    await pool.query(
      `INSERT INTO prototype_comments
         (id, prototype_id, version_id, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, COALESCE($5::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET
         prototype_id = EXCLUDED.prototype_id,
         version_id = EXCLUDED.version_id,
         -- Full PUT remains useful for create/migration/recolor, but lifecycle
         -- fields are server-owned and cannot be clobbered by delayed writes.
         data = (EXCLUDED.data - 'status' - 'resolvedAt' - 'resolvedBy' - 'statusHistory' - 'deletedAt')
           || jsonb_strip_nulls(jsonb_build_object(
             'status', CASE
               WHEN prototype_comments.data->>'status' IN ('open', 'resolved') THEN prototype_comments.data->'status'
                WHEN jsonb_typeof(prototype_comments.data->'deletedAt') = 'string'
                  AND pg_input_is_valid(prototype_comments.data->>'deletedAt', 'timestamp with time zone')
                  THEN '"resolved"'::jsonb
               ELSE COALESCE(EXCLUDED.data->'status', '"open"'::jsonb)
             END,
             'resolvedAt', CASE
               WHEN prototype_comments.data->>'status' IN ('open', 'resolved') THEN prototype_comments.data->'resolvedAt'
                WHEN jsonb_typeof(prototype_comments.data->'deletedAt') = 'string'
                  AND pg_input_is_valid(prototype_comments.data->>'deletedAt', 'timestamp with time zone')
                  THEN COALESCE(prototype_comments.data->'resolvedAt', prototype_comments.data->'deletedAt')
               ELSE EXCLUDED.data->'resolvedAt'
             END,
             'resolvedBy', prototype_comments.data->'resolvedBy',
             'statusHistory', prototype_comments.data->'statusHistory',
             'deletedAt', COALESCE(prototype_comments.data->'deletedAt', EXCLUDED.data->'deletedAt')
           )),
         updated_at = NOW()`,
      [
        id,
        prototypeId,
        typeof req.body.versionId === "string" ? req.body.versionId : null,
        JSON.stringify(body),
        typeof req.body.createdAt === "string" ? req.body.createdAt : null,
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.patch("/prototypes/:prototypeId/comments/:id/status", async (req, res, next) => {
  const { prototypeId, id } = req.params;
  const action = req.body?.action;
  const actor = typeof req.body?.actor === "string" ? req.body.actor.trim() : "";
  if ((action !== "resolve" && action !== "reopen") || !actor) {
    res.status(400).json({ error: 'action must be "resolve" or "reopen" and actor is required' });
    return;
  }
  try {
    const result = await pool.query(
      `UPDATE prototype_comments
          SET data = CASE
            -- Direct PATCH callers also recover a legacy record without
            -- manufacturing a new resolve event.
            WHEN $3 = 'resolve'
              AND COALESCE(data->>'status', '') NOT IN ('open', 'resolved')
              AND jsonb_typeof(data->'deletedAt') = 'string'
              AND pg_input_is_valid(data->>'deletedAt', 'timestamp with time zone')
              THEN jsonb_set(
                jsonb_set(data, '{status}', '"resolved"'::jsonb),
                '{resolvedAt}', COALESCE(data->'resolvedAt', data->'deletedAt')
              )
            WHEN $3 = 'resolve' AND COALESCE(
              data->>'status',
              CASE
                WHEN jsonb_typeof(data->'deletedAt') = 'string'
                  AND pg_input_is_valid(data->>'deletedAt', 'timestamp with time zone')
                  THEN 'resolved'
                ELSE 'open'
              END
            ) <> 'resolved'
              THEN jsonb_set(
                jsonb_set(
                  jsonb_set(data, '{status}', '"resolved"'::jsonb),
                  '{resolvedAt}', to_jsonb(NOW()::text)
                ),
                '{resolvedBy}', to_jsonb($4::text)
              ) || jsonb_build_object('statusHistory', COALESCE(data->'statusHistory', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('action', 'resolve', 'actor', $4, 'at', NOW()::text)))
            WHEN $3 = 'reopen' AND COALESCE(
              data->>'status',
              CASE
                WHEN jsonb_typeof(data->'deletedAt') = 'string'
                  AND pg_input_is_valid(data->>'deletedAt', 'timestamp with time zone')
                  THEN 'resolved'
                ELSE 'open'
              END
            ) = 'resolved'
              THEN (data - 'resolvedAt' - 'resolvedBy') || jsonb_build_object('status', 'open', 'statusHistory', COALESCE(data->'statusHistory', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('action', 'reopen', 'actor', $4, 'at', NOW()::text)))
            ELSE data
          END,
          updated_at = NOW()
        WHERE prototype_id = $1 AND id = $2
        RETURNING id, prototype_id, version_id, data`,
      [prototypeId, id, action, actor],
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "comment not found" });
      return;
    }
    res.json(canonicalComment(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

router.delete("/prototypes/:prototypeId/comments/:id", (_req, res) => {
  res.status(405).json({ error: "Comment deletion is disabled. Resolve the comment to preserve review history." });
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