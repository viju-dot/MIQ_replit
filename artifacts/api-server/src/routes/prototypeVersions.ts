import { Router, type IRouter } from "express";
import { Pool } from "pg";
import { z } from "zod";

const router: IRouter = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const VersionSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  description: z.string().max(2000).optional(),
  rendererKey: z.enum(["v3", "v4", "v5", "dashboard", "dooh"]),
  status: z.enum(["active", "archived"]),
  metadata: z.object({ createdFrom: z.string().max(100) }).optional(),
  snapshot: z.object({
    description: z.string().max(2000),
    status: z.enum(["Live", "Draft", "Archived"]),
    notes: z.string().max(4000).optional(),
  }).optional(),
});

function nextVersionName(names: string[]): string {
  const max = names.reduce((value, name) => {
    const match = /^V(\d+)$/.exec(name);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `V${max + 1}`;
}

router.get(
  "/prototypes/:prototypeId/versions",
  async (req, res, next): Promise<void> => {
    res.set("Cache-Control", "no-store");
    try {
      const result = await pool.query(
        `SELECT id, data
           FROM prototype_versions
          WHERE prototype_id = $1
          ORDER BY created_at ASC, id ASC`,
        [req.params.prototypeId],
      );
      res.json(result.rows.map((row) => ({ ...row.data, id: row.id })));
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/prototypes/:prototypeId/versions/:versionId",
  async (req, res, next): Promise<void> => {
    const { prototypeId, versionId } = req.params;
    const parsed = VersionSchema.safeParse(req.body?.version);
    if (
      req.body?.prototypeId !== prototypeId ||
      !parsed.success ||
      parsed.data.id !== versionId
    ) {
      res.status(400).json({ error: "prototypeId and version identity must match the route" });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Serialize label allocation and per-version writes without serializing
      // unrelated prototypes.
      await client.query(
        "SELECT pg_advisory_xact_lock(178622145, hashtext($1))",
        [prototypeId],
      );
      const existingResult = await client.query(
        `SELECT data
           FROM prototype_versions
          WHERE prototype_id = $1 AND id = $2
          FOR UPDATE`,
        [prototypeId, versionId],
      );

      let version = parsed.data;
      if (existingResult.rows[0]) {
        const existing = VersionSchema.parse(existingResult.rows[0].data);
        // Delayed writes from another open tab must not roll back a newer
        // archive/unarchive or metadata update.
        if (Date.parse(version.updatedAt) <= Date.parse(existing.updatedAt)) {
          version = existing;
        } else {
          await client.query(
            `UPDATE prototype_versions
                SET data = $3::jsonb, updated_at = NOW()
              WHERE prototype_id = $1 AND id = $2`,
            [prototypeId, versionId, JSON.stringify(version)],
          );
        }
      } else {
        const labelsResult = await client.query(
          `SELECT data->>'name' AS name, data->>'status' AS status
             FROM prototype_versions
            WHERE prototype_id = $1`,
          [prototypeId],
        );
        const labels = labelsResult.rows.map((row) => row.name);
        // The requested map-only V5 is a new canonical branch, not an
        // unarchive/overwrite of an earlier discarded V5. Its public label
        // can be reused when only archived history occupies that name.
        const newDoohMapV5 = prototypeId === "dooh" && versionId === "dooh_v5" &&
          version.name === "V5" &&
          !labelsResult.rows.some(row => row.name === "V5" && row.status !== "archived");
        version = {
          ...version,
          // Preserve the requested label when it is free. This supports
          // migrating a single newer version before the browser has uploaded
          // the seeded history. Concurrent copies with the same label still
          // receive distinct sequential names under the advisory lock.
          name: labels.includes(version.name) && !newDoohMapV5
            ? nextVersionName(labels)
            : version.name,
        };
        await client.query(
          `INSERT INTO prototype_versions
             (prototype_id, id, data, created_at, updated_at)
           VALUES ($1, $2, $3::jsonb, $4::timestamptz, NOW())`,
          [prototypeId, versionId, JSON.stringify(version), version.createdAt],
        );
      }

      await client.query("COMMIT");
      res.json(version);
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  },
);

export default router;
