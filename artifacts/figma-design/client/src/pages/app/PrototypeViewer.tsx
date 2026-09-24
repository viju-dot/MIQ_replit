/* =========================================================================
 * MIQ Collaborative Frameworks — Prototype Viewer content
 *
 * Rendered inside the DS Side Panel drawer (authoring) and reused (read-only)
 * on the public /share/:token view. Scalable, clearly-separated Fiber sections:
 *   - Prototype Details (name, status, description, route link)
 *   - Version History (list newest-first; switch versions; save new version)
 *   - Share Settings (secure toggle, share link + copy, password controls)
 *   - Activity Timeline (placeholder empty state)
 *   - Prototype Metadata (placeholder)
 *
 * COLOR CONVENTION: token-driven colors via inline style objects; layout /
 * spacing / typography-size stay as classes.
 * ========================================================================= */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowSquareOut,
  Copy,
  Check,
  Eye,
  EyeSlash,
  Clock,
  Info,
  ClockCounterClockwise,
  ShareNetwork,
  Lock,
  LockOpen,
  FilePlus,
  CopySimple,
  Archive as ArchiveIcon,
  ArrowCounterClockwise,
  WarningCircle,
  type IconProps,
} from "@phosphor-icons/react";
import {
  prototypeRepository,
  newShareToken,
  newPassword,
  type Prototype,
  type PrototypeVersion,
  type ShareConfig,
} from "@/lib/prototypeStore";
import { putShare, deleteShare, getShareMeta } from "@/lib/shareApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  brandBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBgHover: "var(--container-dynamic-brand-bold-background-hover,#702ea3)",
  brandFgOn: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
  inputBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  successBg: "var(--container-dynamic-success-subtle-background-default,#e7faef)",
  successFg: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
  errorBg: "var(--container-dynamic-error-subtle-background-selected,#ffedef)",
  errorBorder: "var(--border-dynamic-error-default,#da294b)",
  errorFg: "var(--container-dynamic-error-subtle-foreground-default,#da294b)",
};

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Live: { bg: C.successBg, fg: C.successFg },
  Draft: { bg: C.hoverBg, fg: C.textMuted },
  Archived: { bg: C.hoverBg, fg: C.textMuted },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

function Section({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: React.ComponentType<IconProps>;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col gap-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)]"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={18} color={C.brandFg} />
          <h3 className="text-[15px] font-semibold" style={{ color: C.textPrimary }}>
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------------------------------------------ */
/* Copy button                                                         */
/* ------------------------------------------------------------------ */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — non-fatal in prototype */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radiuses-small,2px)] border px-2.5 py-1.5 text-[13px] font-medium transition-colors"
      style={{
        borderColor: C.border,
        backgroundColor: hover ? C.hoverBg : C.surface,
        color: copied ? C.successFg : C.textBody,
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Read-only line + external link                                      */
/* ------------------------------------------------------------------ */

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-25,2px)]">
      <span className="text-[12px] font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>
        {label}
      </span>
      <div className="text-[14px]" style={{ color: C.textBody }}>
        {children}
      </div>
    </div>
  );
}

function OpenRouteLink({ route }: { route: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={route}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors"
      style={{ color: hover ? C.brandFg : C.brandFg, textDecoration: hover ? "underline" : "none" }}
    >
      <ArrowSquareOut size={15} />
      Open prototype
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Version history                                                     */
/* ------------------------------------------------------------------ */

function VersionHistory({
  versions,
  selectedId,
  onSelect,
  onSaveNew,
  onDuplicate,
  onArchive,
  onRestore,
  readOnly,
}: {
  versions: PrototypeVersion[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onSaveNew?: () => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  readOnly: boolean;
}) {
  const [listMode, setListMode] = useState<"active" | "archived">("active");
  const [pending, setPending] = useState<{
    kind: "duplicate" | "archive";
    version: PrototypeVersion;
  } | null>(null);
  const activeCount = versions.filter(
    (version) => version.status !== "archived",
  ).length;
  const ordered = versions
    .filter((version) =>
      listMode === "active"
        ? version.status !== "archived"
        : version.status === "archived",
    )
    .slice()
    .reverse();
  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "duplicate") onDuplicate(pending.version.id);
    else onArchive(pending.version.id);
    setPending(null);
  };
  return (
    <>
      <Section
        icon={ClockCounterClockwise}
        title="Version History"
        action={
          !readOnly && onSaveNew ? <SaveVersionButton onClick={onSaveNew} /> : undefined
        }
      >
        <div
          className="inline-flex self-start rounded-[var(--radius-50,4px)] border border-solid p-0.5"
          style={{ borderColor: C.border }}
          aria-label="Version status"
        >
          {(["active", "archived"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={listMode === mode}
              onClick={() => setListMode(mode)}
              className="rounded-[var(--radius-50,4px)] px-2.5 py-1.5 text-[12px] font-medium"
              style={{
                backgroundColor: listMode === mode ? C.brandSubtle : "transparent",
                color: listMode === mode ? C.brandFg : C.textBody,
              }}
            >
              {mode === "active" ? "Active Versions" : "Archived Versions"}
            </button>
          ))}
        </div>
        {ordered.length === 0 ? (
          <p className="text-[14px]" style={{ color: C.textMuted }}>
            {listMode === "active"
              ? "No active versions."
              : "No archived versions."}
          </p>
        ) : (
          <ol className="flex flex-col gap-[var(--spacing-100,8px)]">
            {ordered.map((v) => (
              <VersionRow
                key={v.id}
                version={v}
                selected={v.id === selectedId}
                onSelect={() => onSelect(v.id)}
                readOnly={readOnly}
                archiveDisabled={v.status !== "archived" && activeCount <= 1}
                onDuplicate={() => setPending({ kind: "duplicate", version: v })}
                onArchive={() => setPending({ kind: "archive", version: v })}
                onRestore={() => onRestore(v.id)}
              />
            ))}
          </ol>
        )}
      </Section>
      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.kind === "duplicate"
                ? `Duplicate ${pending.version.name}?`
                : `Archive ${pending?.version.name ?? ""}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === "duplicate"
                ? "Choose how you want to create the new version."
                : "This version will be removed from the active version list but won't be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>
              {pending?.kind === "duplicate"
                ? `Duplicate exact copy of ${pending.version.name}`
                : "Archive Version"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function VersionRow({
  version,
  selected,
  onSelect,
  readOnly,
  archiveDisabled,
  onDuplicate,
  onArchive,
  onRestore,
}: {
  version: PrototypeVersion;
  selected: boolean;
  onSelect: () => void;
  readOnly: boolean;
  archiveDisabled: boolean;
  onDuplicate: () => void;
  onArchive: () => void;
  onRestore: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <li
      className="rounded-[var(--radius-50,4px)] border border-solid p-[var(--spacing-150,12px)] transition-colors"
      style={{
        borderColor: selected ? C.brandFg : C.border,
        backgroundColor: selected ? C.brandSubtle : hover ? C.hoverBg : C.surface,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full flex-col gap-[var(--spacing-25,2px)] text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[14px] font-semibold"
            style={{ color: selected ? C.brandFg : C.textPrimary }}
          >
            {version.name}
          </span>
          {selected && (
            <span className="text-[11px] font-medium" style={{ color: C.brandFg }}>
              Viewing
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 text-[12px]" style={{ color: C.textMuted }}>
          <span>Created {fmtDate(version.createdAt)} · {fmtTime(version.createdAt)}</span>
          <span>Status: {version.status === "archived" ? "Archived" : "Active"}</span>
        </div>
        {version.metadata?.createdFrom && (
          <span className="text-[12px]" style={{ color: C.textMuted }}>
            Created from: {version.metadata.createdFrom}
          </span>
        )}
        {version.description && (
          <p className="text-[13px]" style={{ color: C.textBody }}>
            {version.description}
          </p>
        )}
      </button>
      {!readOnly && (
        <div className="mt-2 flex justify-end gap-1.5">
          {version.status !== "archived" ? (
            <>
              <VersionAction
                label={`Duplicate ${version.name}`}
                icon={CopySimple}
                onClick={onDuplicate}
              />
              <VersionAction
                label={`Archive ${version.name}`}
                icon={ArchiveIcon}
                onClick={onArchive}
                disabled={archiveDisabled}
                title={
                  archiveDisabled
                    ? "The last active version cannot be archived"
                    : `Archive ${version.name}`
                }
              />
            </>
          ) : (
            <>
              <VersionAction
                label={`Duplicate ${version.name}`}
                icon={CopySimple}
                onClick={onDuplicate}
              />
              <VersionAction
                label={`Restore ${version.name}`}
                icon={ArrowCounterClockwise}
                onClick={onRestore}
              />
            </>
          )}
        </div>
      )}
    </li>
  );
}

function VersionAction({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  title,
}: {
  label: string;
  icon: React.ComponentType<IconProps>;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-[var(--radiuses-small,2px)] px-2 py-1 text-[12px] font-medium disabled:cursor-not-allowed disabled:opacity-50"
      style={{ color: C.brandFg }}
    >
      <Icon size={14} />
      {label.split(" ")[0]}
    </button>
  );
}

function SaveVersionButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 rounded-[var(--radiuses-small,2px)] px-2.5 py-1.5 text-[13px] font-medium transition-colors"
      style={{ backgroundColor: hover ? C.brandBgHover : C.brandBg, color: C.brandFgOn }}
    >
      <FilePlus size={14} />
      Save new version
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Share settings                                                      */
/* ------------------------------------------------------------------ */

function shareUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, "")
      : "";
  return `${base}/share/${token}`;
}

function ToggleRow({
  on,
  onToggle,
  labelOn,
  labelOff,
}: {
  on: boolean;
  onToggle: () => void;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="inline-flex items-center gap-2"
    >
      <span
        className="relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors"
        style={{ backgroundColor: on ? C.brandBg : C.inputBorder }}
      >
        <span
          className="absolute h-[16px] w-[16px] rounded-full bg-white transition-all"
          style={{ left: on ? "18px" : "2px" }}
        />
      </span>
      <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>
        {on ? labelOn : labelOff}
      </span>
    </button>
  );
}

function ShareSettings({
  prototype,
  onChange,
  syncError,
}: {
  prototype: Prototype;
  onChange: (share: ShareConfig) => void;
  syncError: string | null;
}) {
  const share = prototype.share;

  const enable = () => {
    const token = share.token || newShareToken();
    onChange({ ...share, enabled: true, token });
  };
  const disable = () => onChange({ ...share, enabled: false });
  const toggleSecured = () => {
    if (!share.secured) {
      // Turning security on — ensure a password exists.
      onChange({ ...share, secured: true, password: share.password || newPassword() });
    } else {
      onChange({ ...share, secured: false });
    }
  };
  const regenPassword = () => onChange({ ...share, password: newPassword() });

  return (
    <Section icon={ShareNetwork} title="Share Settings">
      <ToggleRow
        on={share.enabled}
        onToggle={share.enabled ? disable : enable}
        labelOn="Sharing on"
        labelOff="Sharing off"
      />

      {syncError && (
        <div
          className="flex items-center gap-2 rounded-[var(--radiuses-small,2px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
          style={{ backgroundColor: C.errorBg, borderColor: C.errorBorder }}
          role="alert"
        >
          <WarningCircle size={16} weight="fill" color={C.errorFg} />
          <span className="text-[13px]" style={{ color: C.errorFg }}>
            {syncError} Changes are saved locally but may not be visible to
            recipients until sync succeeds.
          </span>
        </div>
      )}

      {share.enabled && (
        <div className="flex flex-col gap-[var(--spacing-200,16px)]">
          {/* Share link */}
          <DetailRow label="Share link">
            <div className="flex flex-wrap items-center gap-2">
              <code
                className="min-w-0 flex-1 truncate rounded-[var(--radiuses-small,2px)] border px-2.5 py-1.5 text-[13px]"
                style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.hoverBg }}
              >
                {shareUrl(share.token)}
              </code>
              <CopyButton value={shareUrl(share.token)} label="Copy link" />
            </div>
          </DetailRow>

          {/* Security toggle */}
          <div className="flex items-center gap-2">
            {share.secured ? (
              <Lock size={16} color={C.brandFg} />
            ) : (
              <LockOpen size={16} color={C.textMuted} />
            )}
            <ToggleRow
              on={share.secured}
              onToggle={toggleSecured}
              labelOn="Secured"
              labelOff="Not secured"
            />
          </div>

          {/* Password controls */}
          {share.secured && (
            <DetailRow label="Password">
              <div className="flex flex-wrap items-center gap-2">
                <code
                  className="min-w-0 flex-1 truncate rounded-[var(--radiuses-small,2px)] border px-2.5 py-1.5 text-[13px]"
                  style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.hoverBg }}
                >
                  {share.password}
                </code>
                <CopyButton value={share.password} label="Copy password" />
                <ChangePasswordControl
                  onGenerate={regenPassword}
                  onSet={(pw) => onChange({ ...share, password: pw })}
                />
              </div>
            </DetailRow>
          )}
        </div>
      )}
    </Section>
  );
}

function ChangePasswordControl({
  onGenerate,
  onSet,
}: {
  onGenerate: () => void;
  onSet: (pw: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [hover, setHover] = useState(false);

  if (editing) {
    return (
      <span className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          autoFocus
          placeholder="New password"
          onChange={(e) => setValue(e.target.value)}
          className="h-[32px] rounded-[var(--radiuses-small,2px)] border px-2.5 text-[13px] outline-none"
          style={{ borderColor: C.inputBorder, color: C.textPrimary, backgroundColor: C.surface }}
        />
        <button
          type="button"
          onClick={() => {
            if (value.trim()) onSet(value.trim());
            setValue("");
            setEditing(false);
          }}
          className="rounded-[var(--radiuses-small,2px)] px-2.5 py-1.5 text-[13px] font-medium"
          style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
        >
          Set
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={onGenerate}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="rounded-[var(--radiuses-small,2px)] border px-2.5 py-1.5 text-[13px] font-medium transition-colors"
        style={{
          borderColor: C.border,
          backgroundColor: hover ? C.hoverBg : C.surface,
          color: C.textBody,
        }}
      >
        Generate new
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-[var(--radiuses-small,2px)] px-2.5 py-1.5 text-[13px] font-medium"
        style={{ color: C.brandFg }}
      >
        Type new
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Placeholder sections                                                */
/* ------------------------------------------------------------------ */

function EmptyBlock({ text }: { text: string }) {
  return (
    <div
      className="flex min-h-[96px] items-center justify-center rounded-[var(--radius-50,4px)] border border-dashed p-[var(--spacing-200,16px)] text-center"
      style={{ borderColor: C.border }}
    >
      <p className="max-w-[360px] text-[13px]" style={{ color: C.textMuted }}>
        {text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main viewer                                                         */
/* ------------------------------------------------------------------ */

export interface PrototypeViewerProps {
  prototype: Prototype;
  /** Read-only mode (public share view) hides authoring controls. */
  readOnly?: boolean;
  /** Called when the store changes so the host can refresh its copy. */
  onChanged?: (updated: Prototype) => void;
}

export function PrototypeViewer({
  prototype,
  readOnly = false,
  onChanged,
}: PrototypeViewerProps): JSX.Element {
  // Selected version defaults to the newest active version.
  const activeVersions = prototype.versions.filter(
    (version) => version.status !== "archived",
  );
  const newest = activeVersions[activeVersions.length - 1];
  const [selectedId, setSelectedId] = useState<string | undefined>(newest?.id);
  const selected =
    prototype.versions.find((v) => v.id === selectedId) ??
    newest ??
    prototype.versions[prototype.versions.length - 1];
  const isNewest = !selected || selected.id === newest?.id;

  // Details reflect the SELECTED version's frozen snapshot. The newest version
  // maps to the live/current prototype fields.
  const displayData: { description: string; status: string; notes?: string } = isNewest
    ? { description: prototype.description, status: prototype.status }
    : {
        description: selected?.snapshot?.description ?? prototype.description,
        status: selected?.snapshot?.status ?? prototype.status,
        notes: selected?.snapshot?.notes,
      };

  // Surfaced (no silent fallback) when server-side share sync fails.
  const [syncError, setSyncError] = useState<string | null>(null);

  /**
   * Serialize share sync per prototype: every PUT/DELETE/reconcile is appended
   * to a single promise chain so operations can NEVER complete out of order and
   * resurrect stale state (e.g. a slow enable landing after a fast disable).
   */
  const syncChain = useRef<Promise<void>>(Promise.resolve());
  // Bumped on every user-initiated share change; the reconcile effect checks it
  // so it won't fire a stale PUT if the user changed something meanwhile.
  const userChangeSeq = useRef(0);

  const runSync = (task: () => Promise<void>): void => {
    syncChain.current = syncChain.current
      .catch(() => undefined) // isolate: one failure must not break the chain
      .then(task);
  };

  /**
   * Persist the current share state to the API server so the link works in any
   * browser. Enabled → PUT snapshot (incl. versions); disabled → DELETE.
   */
  const doSyncShare = async (updated: Prototype): Promise<void> => {
    const s = updated.share;
    try {
      if (s.enabled) {
        await putShare(s.token, s.secured, s.password, updated);
      } else if (s.token) {
        await deleteShare(s.token);
      }
      setSyncError(null);
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : "Couldn't sync share to the server.",
      );
    }
  };

  /**
   * Reconcile on open: a share may have been enabled before server-side
   * persistence existed (or the server restarted and lost its in-memory
   * records), leaving local state "enabled" without a server record. If the
   * server doesn't know this token, re-push the snapshot — but ONLY if the user
   * hasn't made a share change in the meantime (guarded by userChangeSeq), and
   * queued on the same chain so it can't race with user PUT/DELETE.
   */
  useEffect(() => {
    if (readOnly || !prototype.share.enabled || !prototype.share.token) return;
    const token = prototype.share.token;
    const seqAtStart = userChangeSeq.current;
    let cancelled = false;
    runSync(async () => {
      if (cancelled || userChangeSeq.current !== seqAtStart) return;
      try {
        const meta = await getShareMeta(token);
        if (cancelled || userChangeSeq.current !== seqAtStart) return;
        if (!meta.exists) await doSyncShare(prototype);
      } catch (err) {
        if (!cancelled)
          setSyncError(
            err instanceof Error ? err.message : "Couldn't sync share to the server.",
          );
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prototype.id, readOnly]);

  const saveNewVersion = () => {
    const updated = prototypeRepository.addVersion(prototype.id);
    const latest = updated.versions[updated.versions.length - 1];
    setSelectedId(latest?.id);
    onChanged?.(updated);
    // If this prototype is currently shared, push the new version snapshot
    // (queued on the same chain to preserve ordering).
    if (updated.share.enabled) runSync(() => doSyncShare(updated));
  };

  const duplicateVersion = (sourceVersionId: string) => {
    const updated = prototypeRepository.duplicateVersion(
      prototype.id,
      sourceVersionId,
    );
    const created = updated.versions[updated.versions.length - 1];
    setSelectedId(created?.id);
    onChanged?.(updated);
    if (updated.share.enabled) runSync(() => doSyncShare(updated));
  };

  const archiveVersion = (versionId: string) => {
    const updated = prototypeRepository.archiveVersion(prototype.id, versionId);
    if (selectedId === versionId) {
      const active = updated.versions.filter(
        (version) => version.status !== "archived",
      );
      setSelectedId(active[active.length - 1]?.id);
    }
    onChanged?.(updated);
    if (updated.share.enabled) runSync(() => doSyncShare(updated));
  };

  const restoreVersion = (versionId: string) => {
    const updated = prototypeRepository.unarchiveVersion(prototype.id, versionId);
    onChanged?.(updated);
    if (updated.share.enabled) runSync(() => doSyncShare(updated));
  };

  const setShare = (share: ShareConfig) => {
    userChangeSeq.current += 1; // user intent supersedes any pending reconcile
    const updated = prototypeRepository.setShare(prototype.id, share);
    onChanged?.(updated);
    runSync(() => doSyncShare(updated));
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)] p-[var(--spacing-300,24px)]">
      {/* Version context banner */}
      {selected && (
        <div
          className="flex items-center gap-2 rounded-[var(--radius-50,4px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
          style={{ backgroundColor: C.brandSubtle }}
        >
          <Clock size={15} color={C.brandFg} />
          <span className="text-[13px] font-medium" style={{ color: C.brandFg }}>
            Viewing {selected.name}
            {isNewest ? " (current)" : ""}
          </span>
        </div>
      )}

      {/* Prototype Details */}
      <Section icon={Info} title="Prototype Details">
        <div className="flex flex-col gap-[var(--spacing-150,12px)]">
          <DetailRow label="Name">
            <span className="font-medium" style={{ color: C.textPrimary }}>
              {prototype.name}
            </span>
          </DetailRow>
          <DetailRow label="Status">
            <StatusPill status={displayData.status} />
          </DetailRow>
          <DetailRow label="Description">{displayData.description || "—"}</DetailRow>
          {displayData.notes && (
            <DetailRow label="Notes">{displayData.notes}</DetailRow>
          )}
          <DetailRow label="Route">
            <OpenRouteLink route={prototype.id === "dooh" && selected
              ? `${prototype.route}?version=${encodeURIComponent(selected.id)}`
              : prototype.route} />
          </DetailRow>
        </div>
      </Section>

      {/* Version History */}
      <VersionHistory
        versions={prototype.versions}
        selectedId={selected?.id}
        onSelect={setSelectedId}
        onSaveNew={saveNewVersion}
        onDuplicate={duplicateVersion}
        onArchive={archiveVersion}
        onRestore={restoreVersion}
        readOnly={readOnly}
      />

      {/* Share Settings (authoring only) */}
      {!readOnly && (
        <ShareSettings prototype={prototype} onChange={setShare} syncError={syncError} />
      )}

      {/* Activity Timeline (placeholder) */}
      <Section icon={Clock} title="Activity Timeline">
        <EmptyBlock text="Activity for this prototype — edits, shares and test runs — will appear here." />
      </Section>

      {/* Prototype Metadata (placeholder) */}
      <Section icon={Info} title="Prototype Metadata">
        <EmptyBlock text="Owner, tags, linked flows and other metadata will surface here." />
      </Section>
    </div>
  );
}

// Eye / EyeSlash re-exported for the shared-view password screen.
export { Eye, EyeSlash };
