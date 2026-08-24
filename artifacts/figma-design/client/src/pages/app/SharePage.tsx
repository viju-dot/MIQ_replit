/* =========================================================================
 * MIQ Collaborative Frameworks — public shared prototype view (/share/:token)
 *
 * PUBLIC route (NOT behind RequireAuth). A recipient with a share link sees a
 * single prototype in read-only mode:
 *   - unknown / disabled token → friendly invalid-link page
 *   - secured link → minimal password screen (show/hide toggle, no username);
 *     wrong password → inline error; a sessionStorage flag (per token) unlocks
 *   - once unlocked → read-only PrototypeViewer (details + version history,
 *     version switching), MIQ-branded, no global header / module nav.
 *
 * COLOR CONVENTION: token-driven colors via inline style objects.
 * ========================================================================= */

import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { WarningCircle, Eye, EyeSlash, LinkBreak, SpinnerGap } from "@phosphor-icons/react";
import type { Prototype } from "@/lib/prototypeStore";
import {
  getShareMeta,
  unlockShare,
  ShareRateLimitError,
  type ShareSnapshot,
} from "@/lib/shareApi";
import { PrototypeViewer } from "./PrototypeViewer";
import { ThemeToggle } from "./WorkspaceHeader";

/**
 * Adapt a server snapshot into the Prototype shape PrototypeViewer expects.
 * Share config is irrelevant here (read-only hides Share Settings), so we
 * supply a disabled placeholder.
 */
function snapshotToPrototype(s: ShareSnapshot): Prototype {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    status: (s.status as Prototype["status"]) ?? "Draft",
    route: s.route,
    createdAt: s.versions[0]?.createdAt ?? "",
    versions: s.versions,
    share: { enabled: false, token: "", secured: false, password: "" },
  };
}

const LOGO_SRC = `${import.meta.env.BASE_URL}figmaAssets/miq-lettermark.svg`;

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  inputBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  inputBorderFocus: "var(--border-dynamic-brand-default,#7c33b5)",
  brandBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBgHover: "var(--container-dynamic-brand-bold-background-hover,#702ea3)",
  brandFgOn: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  errorBorder: "var(--border-dynamic-error-default,#da294b)",
  errorBg: "var(--container-dynamic-error-subtle-background-selected,#ffedef)",
  errorFg: "var(--container-dynamic-error-subtle-foreground-default,#da294b)",
};

const FONT = { fontFamily: '"Poppins", "DM Sans", sans-serif' } as const;

const unlockKey = (token: string) => `fiber.share.${token}`;

/**
 * Per-token, per-session "this recipient has unlocked once" marker. We do NOT
 * store the password, so a fresh session must re-enter it via the server-side
 * gate; the flag is a UX/analytics hint only.
 */
function setUnlocked(token: string): void {
  try {
    sessionStorage.setItem(unlockKey(token), "1");
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Brand shell (no global header)                                      */
/* ------------------------------------------------------------------ */

function ShareShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: C.canvasBg, ...FONT }}>
      <header
        className="flex items-center gap-2.5 border-b px-4 py-3 md:px-6"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <img src={LOGO_SRC} alt="MIQ" className="block w-auto shrink-0" style={{ height: 22 }} />
        <span className="flex-1 text-[15px] font-semibold" style={{ color: C.textPrimary }}>
          Shared prototype
        </span>
        <ThemeToggle />
      </header>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Invalid link                                                        */
/* ------------------------------------------------------------------ */

function InvalidLink() {
  return (
    <ShareShell>
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[520px] flex-col items-center justify-center gap-[var(--spacing-300,24px)] px-6 text-center">
        <span
          className="flex size-[56px] items-center justify-center rounded-full"
          style={{ backgroundColor: C.errorBg }}
        >
          <LinkBreak size={28} color={C.errorFg} />
        </span>
        <div className="flex flex-col gap-[var(--spacing-100,8px)]">
          <h1
            className="text-[length:var(--headline-md-semibold-size,24px)] font-semibold tracking-[-0.36px]"
            style={{ color: C.textPrimary }}
          >
            This link isn't available
          </h1>
          <p className="text-[length:var(--body-lg-regular-size,16px)]" style={{ color: C.textMuted }}>
            The share link is invalid or has been turned off. Please ask the owner for an up-to-date
            link.
          </p>
        </div>
      </div>
    </ShareShell>
  );
}

/* ------------------------------------------------------------------ */
/* Password gate                                                       */
/* ------------------------------------------------------------------ */

function PasswordGate({
  token,
  onUnlock,
}: {
  token: string;
  /** Receives the server-verified prototype snapshot on success. */
  onUnlock: (snapshot: ShareSnapshot) => void;
}) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      // Server verifies the password — it is never resolved on the client.
      const snapshot = await unlockShare(token, password);
      if (snapshot) {
        setUnlocked(token);
        onUnlock(snapshot);
      } else {
        setError("Incorrect password.");
      }
    } catch (err) {
      setError(
        err instanceof ShareRateLimitError
          ? err.message
          : "Couldn't reach the server. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ShareShell>
      <div className="flex min-h-[60vh] items-center justify-center px-[var(--spacing-200,16px)] py-[var(--spacing-500,40px)]">
        <div
          className="flex w-full max-w-[400px] flex-col gap-[var(--spacing-400,32px)] rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-500,40px)] py-[var(--spacing-500,40px)]"
          style={{ backgroundColor: C.surface, borderColor: C.border, boxShadow: "var(--elevation-regular)" }}
        >
          <div className="flex flex-col items-center gap-[var(--spacing-150,12px)] text-center">
            <img src={LOGO_SRC} alt="MIQ" className="block w-auto" style={{ height: 40 }} />
            <div className="flex flex-col gap-[var(--spacing-25,2px)]">
              <h1
                className="text-[length:var(--headline-sm-semibold-size,20px)] font-semibold tracking-[-0.4px]"
                style={{ color: C.textPrimary }}
              >
                Protected prototype
              </h1>
              <p className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: C.textMuted }}>
                Enter the password to view this shared prototype.
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-[var(--spacing-200,16px)]" onSubmit={onSubmit}>
            <label htmlFor="share-password" className="flex w-full flex-col gap-[var(--spacing-75,6px)]">
              <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: C.textPrimary }}>
                Password
              </span>
              <div
                className="flex h-[36px] w-full items-center rounded-[2px] border border-solid pl-[var(--spacing-150,12px)] pr-[var(--spacing-100,8px)] transition-colors"
                style={{
                  backgroundColor: C.surface,
                  borderColor: focused ? C.inputBorderFocus : C.inputBorder,
                }}
              >
                <input
                  id="share-password"
                  type={show ? "text" : "password"}
                  value={password}
                  autoComplete="off"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-[length:var(--body-md-regular-size,14px)] outline-none"
                  style={{ color: C.textPrimary }}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((s) => !s)}
                  className="flex size-[24px] items-center justify-center rounded-[2px]"
                  style={{ color: C.textMuted }}
                >
                  {show ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div
                className="flex items-center gap-[var(--spacing-100,8px)] rounded-[2px] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
                style={{ backgroundColor: C.errorBg, borderColor: C.errorBorder }}
                role="alert"
              >
                <WarningCircle size={16} weight="fill" color="var(--surface-foreground-static-error,#da294b)" />
                <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: C.errorFg }}>
                  {error}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
              className="mt-[var(--spacing-50,4px)] flex h-[36px] w-full items-center justify-center gap-2 rounded-[2px] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors disabled:opacity-70"
              style={{ backgroundColor: submitHover ? C.brandBgHover : C.brandBg, color: C.brandFgOn }}
            >
              {busy && <SpinnerGap size={16} className="animate-spin" />}
              {busy ? "Checking…" : "View prototype"}
            </button>
          </form>
        </div>
      </div>
    </ShareShell>
  );
}

/* ------------------------------------------------------------------ */
/* Shared read-only view                                               */
/* ------------------------------------------------------------------ */

function SharedView({ snapshot }: { snapshot: ShareSnapshot }) {
  const prototype = snapshotToPrototype(snapshot);
  return (
    <ShareShell>
      <div className="mx-auto w-full max-w-[720px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-[var(--spacing-200,16px)] flex flex-col gap-[var(--spacing-50,4px)]">
          <h1
            className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
            style={{ color: C.textPrimary }}
          >
            {prototype.name}
          </h1>
          <p className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: C.textMuted }}>
            You're viewing a shared, read-only prototype.
          </p>
        </div>
        {/* Read-only: hides share/version-authoring controls. */}
        <div
          className="rounded-[var(--radius-100,8px)] border border-solid"
          style={{ borderColor: C.border, backgroundColor: C.canvasBg }}
        >
          <PrototypeViewer prototype={prototype} readOnly />
        </div>
      </div>
    </ShareShell>
  );
}

/* ------------------------------------------------------------------ */
/* Route entry                                                         */
/* ------------------------------------------------------------------ */

function Loading() {
  return (
    <ShareShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <SpinnerGap size={28} className="animate-spin" color={C.textMuted} />
      </div>
    </ShareShell>
  );
}

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "gate" }
  | { kind: "view"; snapshot: ShareSnapshot };

export default function SharePage(): JSX.Element {
  const params = useParams();
  const token = params.token ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setState({ kind: "invalid" });
        return;
      }
      try {
        const meta = await getShareMeta(token);
        if (cancelled) return;
        if (!meta.exists) {
          setState({ kind: "invalid" });
          return;
        }
        if (!meta.secured) {
          // Unsecured: fetch the snapshot directly (empty password unlock).
          const snapshot = await unlockShare(token, "");
          if (cancelled) return;
          setState(snapshot ? { kind: "view", snapshot } : { kind: "invalid" });
          return;
        }
        // Secured: if we unlocked earlier this session, re-fetch via unlock;
        // otherwise show the password gate. (We never persist the password.)
        setState({ kind: "gate" });
      } catch {
        if (!cancelled) setState({ kind: "invalid" });
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.kind === "loading") return <Loading />;
  if (state.kind === "invalid") return <InvalidLink />;
  if (state.kind === "gate") {
    return (
      <PasswordGate
        token={token}
        onUnlock={(snapshot) => setState({ kind: "view", snapshot })}
      />
    );
  }
  return <SharedView snapshot={state.snapshot} />;
}
