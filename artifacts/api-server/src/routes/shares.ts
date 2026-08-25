import { Router, type IRouter, type RequestHandler } from "express";
import * as zod from "zod";
import {
  upsertShare,
  getShare,
  deleteShare,
  hashPassword,
  verifyPassword,
  isValidToken,
  type ShareRecord,
} from "../lib/shareStore";

const router: IRouter = Router();

// Body size limit for the shares router (prototype snapshots are small).
// The app-level express.json() parses first, so we cannot re-limit the parse
// here; instead reject by Content-Length before doing any work. Prevents
// oversized-payload abuse on this public, unauthenticated capability.
const MAX_BODY_BYTES = 64 * 1024;
const limitBody: RequestHandler = (req, res, next) => {
  const len = Number(req.headers["content-length"] ?? "0");
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
    res.status(413).json({ message: "Payload too large" });
    return;
  }
  next();
};

/* ------------------------------------------------------------------ */
/* Validation schemas (defined here — the generated @workspace/api-zod */
/* package is orval output and must not be hand-edited).               */
/* ------------------------------------------------------------------ */

const VersionSnapshotSchema = zod.object({
  description: zod.string(),
  status: zod.string(),
  notes: zod.string().optional(),
});

const ShareVersionSchema = zod.object({
  id: zod.string().min(1),
  name: zod.string().min(1),
  createdAt: zod.string(),
  updatedAt: zod.string(),
  description: zod.string().optional(),
  rendererKey: zod.string().optional(),
  status: zod.enum(["active", "archived"]).optional(),
  metadata: zod
    .object({
      createdFrom: zod.string().optional(),
    })
    .optional(),
  snapshot: VersionSnapshotSchema.optional(),
});

const SharePrototypeSchema = zod.object({
  id: zod.string().min(1),
  name: zod.string().min(1),
  description: zod.string(),
  status: zod.string(),
  route: zod.string().min(1),
  versions: zod.array(ShareVersionSchema).max(500),
});

const UpsertShareSchema = zod.object({
  secured: zod.boolean(),
  password: zod.string().max(256).default(""),
  prototype: SharePrototypeSchema,
});

const UnlockSchema = zod.object({
  password: zod.string().max(256).default(""),
});

/* ------------------------------------------------------------------ */
/* Per-token unlock rate limiting (in-memory, prototype)               */
/* ------------------------------------------------------------------ */

const UNLOCK_MAX = 10; // attempts
const UNLOCK_WINDOW_MS = 60 * 1000; // per minute, per token
const unlockHits = new Map<string, number[]>();

/** Returns true if the token is over its unlock attempt budget. */
function isRateLimited(token: string): boolean {
  const now = Date.now();
  const recent = (unlockHits.get(token) ?? []).filter(
    (t) => now - t < UNLOCK_WINDOW_MS,
  );
  recent.push(now);
  unlockHits.set(token, recent);
  return recent.length > UNLOCK_MAX;
}

/* ------------------------------------------------------------------ */
/* Routes — mounted under /api by app.ts, so these are /api/shares/... */
/* Note: no ownership auth — the unguessable token IS the capability.  */
/* ------------------------------------------------------------------ */

/** Upsert a share snapshot (called whenever share settings / versions change). */
router.put("/shares/:token", limitBody, (req, res) => {
  const token = req.params.token;
  if (!isValidToken(token)) {
    res.status(400).json({ message: "Invalid share token format" });
    return;
  }
  const parsed = UpsertShareSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid share payload", issues: parsed.error.issues });
    return;
  }
  // Hash the password (only when secured); plaintext is never stored.
  const { hash, salt } =
    parsed.data.secured && parsed.data.password
      ? hashPassword(parsed.data.password)
      : { hash: "", salt: "" };
  const record: ShareRecord = {
    token,
    secured: parsed.data.secured,
    passwordHash: hash,
    passwordSalt: salt,
    prototype: parsed.data.prototype,
    updatedAt: Date.now(),
  };
  const ok = upsertShare(record);
  if (!ok) {
    res.status(507).json({ message: "Share store is full" });
    return;
  }
  res.json({ ok: true, token, secured: record.secured });
});

/** Remove a share (called when sharing is disabled). */
router.delete("/shares/:token", (req, res) => {
  const token = req.params.token;
  if (!isValidToken(token)) {
    res.status(400).json({ message: "Invalid share token format" });
    return;
  }
  deleteShare(token);
  res.json({ ok: true });
});

/**
 * Existence + security metadata ONLY. Never returns the password, and never
 * returns prototype data for secured shares (those require /unlock).
 */
router.get("/shares/:token", (req, res) => {
  const token = req.params.token;
  const record = isValidToken(token) ? getShare(token) : undefined;
  if (!record) {
    res.json({ exists: false, secured: false });
    return;
  }
  res.json({ exists: true, secured: record.secured });
});

/**
 * Unlock a share and return its prototype snapshot. Secured shares require a
 * password verified server-side (scrypt + constant-time compare); unsecured
 * shares unlock with any (typically empty) password. The password is never
 * echoed back. Rate-limited per token to slow brute-force attempts.
 */
router.post("/shares/:token/unlock", limitBody, (req, res) => {
  const token = req.params.token;
  if (!isValidToken(token)) {
    res.status(400).json({ message: "Invalid share token format" });
    return;
  }
  if (isRateLimited(token)) {
    res.status(429).json({ message: "Too many attempts. Try again shortly." });
    return;
  }
  const record = getShare(token);
  if (!record) {
    res.status(404).json({ message: "Share not found" });
    return;
  }
  const parsed = UnlockSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid unlock payload" });
    return;
  }
  if (
    record.secured &&
    !verifyPassword(parsed.data.password, record.passwordHash, record.passwordSalt)
  ) {
    res.status(401).json({ message: "Incorrect password" });
    return;
  }
  res.json({ prototype: record.prototype });
});

export default router;
