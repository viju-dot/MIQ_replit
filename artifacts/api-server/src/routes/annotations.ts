/**
 * Design-annotation mirror (figma-design artifact).
 *
 * The prototype's Design Annotation feature stores feedback in the authoring
 * browser's localStorage. This tiny in-memory mirror lets the client sync its
 * latest annotation list so the implementation workflow (which cannot access
 * that browser) can read the designer's feedback.
 *
 * Deliberately minimal: latest snapshot per prototype id, in-memory only
 * (cleared on restart), no auth — same trust model as the dev-only preview.
 */
import { Router, type IRouter } from "express";

const router: IRouter = Router();

const MAX_BODY_BYTES = 64 * 1024;
const mirrors = new Map<string, { updatedAt: string; annotations: unknown }>();

router.put("/annotation-mirror/:prototypeId", (req, res) => {
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
  mirrors.set(req.params.prototypeId, {
    updatedAt: new Date().toISOString(),
    annotations,
  });
  res.json({ ok: true });
});

router.get("/annotation-mirror/:prototypeId", (req, res) => {
  const record = mirrors.get(req.params.prototypeId);
  if (!record) {
    res.status(404).json({ error: "no annotations synced yet" });
    return;
  }
  res.json(record);
});

export default router;
