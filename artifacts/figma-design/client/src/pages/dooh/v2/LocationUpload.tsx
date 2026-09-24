import { Download } from "lucide-react";
import { FiberDropZone } from "@/components/FiberDropZone";
import { MOCK_POSTCODES } from "../data";
import type { UploadReport } from "../uploadHelpers";
import { FiberButton } from "./primitives";

type Method = "postcode" | "latlng";

export function locationSample(method: Method) {
  const examples = Object.entries(MOCK_POSTCODES).slice(0, 3);
  return method === "postcode"
    ? ["postcode", ...examples.map(([postcode]) => postcode)].join("\n")
    : ["lat,lng", ...examples.map(([, point]) => `${point.lat},${point.lng}`)].join("\n");
}

function downloadSample(method: Method) {
  const url = URL.createObjectURL(new Blob([locationSample(method)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `dooh-${method === "postcode" ? "postcodes" : "coordinates"}-sample.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function LocationUpload({ method, file, fileState, report, onSelect, onRemove, onError }: {
  method: Method;
  file: File | null;
  fileState: "Uploading" | "Uploaded";
  report: UploadReport | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onError: (message: string) => void;
}) {
  const label = method === "postcode" ? "postcodes" : "coordinate pairs";
  const total = report ? report.valid + report.unknown.length + report.malformed.length + report.duplicates.length : 0;
  return <div className="space-y-2" style={{ fontFamily: "var(--font-family-body, 'DM Sans', sans-serif)", color: "var(--surface-foreground-static-neutral-lvl1, #13131a)" }}>
    <p className="text-xs" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>
      {method === "postcode" ? "CSV with a postcode column, one postcode per row. This prototype recognises demo postcodes only; the sample contains supported examples." : "CSV with lat and lng columns, one coordinate pair per row. Latitude: −90 to 90; longitude: −180 to 180."}
    </p>
    <FiberButton variant="outline" size="compact" className="w-full" ariaLabel={`Download ${method === "postcode" ? "postcode" : "latitude and longitude"} sample CSV`} onClick={() => downloadSample(method)}>
      <Download size={14} aria-hidden />Download sample CSV
    </FiberButton>
    <details className="rounded border p-2 text-xs" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)", background: "var(--surface-background-lvl2, #f7f7fa)" }}>
      <summary className="cursor-pointer font-medium">Preview sample format</summary>
      <pre className="mt-2 overflow-auto text-xs">{locationSample(method)}</pre>
    </details>
    <FiberDropZone
      accept=".csv,text/csv"
      acceptLabel="Only .csv files supported"
      file={file}
      fileState={fileState}
      onFileSelect={onSelect}
      onFileRemove={onRemove}
      onFileError={onError}
    />
    {file && report && fileState === "Uploaded" && <div role="status" aria-live="polite" className="rounded border p-3 text-xs space-y-2" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)", background: "var(--surface-background-lvl2, #f7f7fa)" }}>
      <p className="font-medium">Upload preview</p>
      <p className="break-all">{file.name}</p>
      <p>{total} {total === 1 ? "entry" : "entries"} read · {report.valid} usable {label}</p>
      {report.valid === 0 && <p>No usable locations found. Check the sample format and upload a corrected file.</p>}
      {report.unknown.length > 0 && <p>Unrecognised ({report.unknown.length}): {report.unknown.slice(0, 6).join(", ")}{report.unknown.length > 6 ? "…" : ""}</p>}
      {report.malformed.length > 0 && <p>Invalid ({report.malformed.length}): {report.malformed.slice(0, 6).join(", ")}{report.malformed.length > 6 ? "…" : ""}</p>}
      {report.duplicates.length > 0 && <p>Duplicates skipped: {report.duplicates.length}</p>}
      <FiberButton variant="outline" size="compact" onClick={onRemove}>Remove file</FiberButton>
    </div>}
  </div>;
}