import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { UploadReport } from "../uploadHelpers";
import { FiberModal, FiberInput } from "./FiberModal";
import { FiberButton } from "./primitives";

export interface UploadPreviewRecord {
  key: string;
  label: string;
  detail?: string;
}

interface UploadPreviewProps {
  fileName: string;
  records: UploadPreviewRecord[];
  report: UploadReport;
  selectedKeys: Set<string>;
  noun: string;
  onToggle: (key: string) => void;
  onRemoveFile: () => void;
}

const textColor = "var(--surface-foreground-static-neutral-lvl1, #13131a)";
const mutedColor = "var(--surface-foreground-static-neutral-lvl3, #717180)";
const borderColor = "var(--border-static-subtle-neutral, #e1e1e8)";
const cardColor = "var(--surface-background-lvl2, #f7f7fa)";

function issueCount(report: UploadReport) {
  return report.unknown.length + report.malformed.length + report.duplicates.length;
}

function IssueGroup({ label, values, tone }: { label: string; values: string[]; tone: string }) {
  if (!values.length) return null;
  return (
    <div className="space-y-1">
      <p className="font-medium" style={{ color: tone }}>{label} ({values.length})</p>
      <p className="break-words" style={{ color: mutedColor }}>{values.join(", ")}</p>
    </div>
  );
}

export function UploadPreview({
  fileName,
  records,
  report,
  selectedKeys,
  noun,
  onToggle,
  onRemoveFile,
}: UploadPreviewProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedCount = selectedKeys.size;
  const totalUploaded = report.valid + report.unknown.length + report.malformed.length + report.duplicates.length;
  const invalidCount = issueCount(report);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleRecords = useMemo(() => {
    if (!normalizedQuery) return records;
    return records.filter(record =>
      `${record.label} ${record.detail ?? ""}`.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, records]);

  const closeModal = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="space-y-2 rounded border p-3 text-xs"
        style={{ borderColor, background: cardColor, color: textColor }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">Overall preview</p>
            <p className="mt-0.5 text-[11px]" style={{ color: mutedColor }}>
              Upload and selection summary
            </p>
          </div>
          <FiberButton
            variant="outline"
            size="compact"
            onClick={() => setOpen(true)}
            ariaLabel={`Preview ${fileName}`}
          >
            Full preview
          </FiberButton>
        </div>
        <p className="break-all" style={{ color: mutedColor }}>{fileName}</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
          <span>Uploaded: <strong>{totalUploaded}</strong></span>
          <span>Usable: <strong>{report.valid}</strong></span>
          <span>Selected: <strong>{selectedCount}</strong></span>
          <span>Not selected: <strong>{records.length - selectedCount}</strong></span>
        </div>
        {invalidCount > 0 && (
          <p style={{ color: "var(--surface-foreground-static-warning, #b45309)" }}>
            Validation issues: {invalidCount}
          </p>
        )}
        {report.valid === 0 && (
          <p style={{ color: "var(--surface-foreground-dynamic-error-default, #da294b)" }}>
            No usable {noun} found. Check the sample format and upload a corrected file.
          </p>
        )}
        <FiberButton variant="outline" size="compact" onClick={onRemoveFile}>Remove file</FiberButton>
      </div>

      <FiberModal
        open={open}
        onOpenChange={closeModal}
        title={fileName}
        description={`Review and select usable ${noun} from ${fileName}.`}
        width="560px"
        footer={(
          <FiberButton variant="outline" onClick={() => closeModal(false)}>Close</FiberButton>
        )}
      >
        <div className="w-full space-y-4" style={{ color: textColor }}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs" role="status" aria-live="polite">
            <span><strong>{selectedCount}</strong> selected</span>
            <span><strong>{records.length - selectedCount}</strong> not selected</span>
            <span><strong>{records.length}</strong> usable of <strong>{totalUploaded}</strong> uploaded</span>
          </div>

          <label className="relative block" htmlFor={`upload-preview-search-${fileName}`}>
            <span className="sr-only">Search visible records</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2"
              style={{ color: mutedColor }}
            />
            <FiberInput
              id={`upload-preview-search-${fileName}`}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={`Search ${noun}`}
              className="pl-8"
            />
          </label>

          <div className="max-h-[320px] w-full overflow-y-auto rounded border" style={{ borderColor }}>
            {visibleRecords.length > 0 ? visibleRecords.map(record => {
              const selected = selectedKeys.has(record.key);
              return (
                <div
                  key={record.key}
                  className="flex items-center gap-2 border-b p-2 last:border-b-0"
                  style={{ borderColor }}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(record.key)}
                    aria-label={`${selected ? "Unselect" : "Select"} ${record.label}`}
                    className="size-4 accent-[var(--border-dynamic-brand-selected,#7c33b5)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{record.label}</p>
                    {record.detail && <p className="truncate text-xs" style={{ color: mutedColor }}>{record.detail}</p>}
                  </div>
                  <FiberButton
                    variant="outline"
                    size="compact"
                    onClick={() => onToggle(record.key)}
                    ariaLabel={`${selected ? "Unselect" : "Select"} ${record.label}`}
                  >
                    {selected ? "Unselect" : "Select"}
                  </FiberButton>
                </div>
              );
            }) : (
              <p className="p-4 text-center text-xs" style={{ color: mutedColor }}>
                No usable records match “{query}”.
              </p>
            )}
          </div>

          {invalidCount > 0 && (
            <div className="space-y-3 rounded border p-3 text-xs" style={{ borderColor, background: cardColor }}>
              <p className="font-medium">Validation details</p>
              <IssueGroup
                label="Unknown"
                values={report.unknown}
                tone="var(--surface-foreground-static-warning, #b45309)"
              />
              <IssueGroup
                label="Malformed"
                values={report.malformed}
                tone="var(--surface-foreground-dynamic-error-default, #da294b)"
              />
              <IssueGroup
                label="Duplicates skipped"
                values={report.duplicates}
                tone="var(--surface-foreground-static-warning, #b45309)"
              />
              <p style={{ color: mutedColor }}>Validation entries are informational and cannot be selected.</p>
            </div>
          )}
        </div>
      </FiberModal>
    </>
  );
}