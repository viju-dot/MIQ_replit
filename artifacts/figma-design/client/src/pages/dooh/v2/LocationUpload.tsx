import { Download } from "lucide-react";
import { FiberDropZone } from "@/components/FiberDropZone";
import { MOCK_POSTCODES } from "../data";
import type { UploadReport } from "../uploadHelpers";
import { FiberButton } from "./primitives";
import { UploadPreview, UploadPreviewOptions, type UploadPreviewRecord } from "./UploadPreview";

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

export function LocationUpload({ method, file, fileState, report, records, selectedKeys, onSelect, onRemove, onError, onToggleRecord }: {
  method: Method;
  file: File | null;
  fileState: "Uploading" | "Uploaded";
  report: UploadReport | null;
  records: UploadPreviewRecord[];
  selectedKeys: Set<string>;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onError: (message: string) => void;
  onToggleRecord: (key: string) => void;
}) {
  const label = method === "postcode" ? "postcodes" : "coordinate pairs";
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
    <UploadPreviewOptions
      hasFile={Boolean(file)}
      ready={Boolean(file && report && fileState === "Uploaded")}
    />
    <FiberDropZone
      accept=".csv,text/csv"
      acceptLabel="Only .csv files supported"
      file={file}
      fileState={fileState}
      onFileSelect={onSelect}
      onFileRemove={onRemove}
      onFileError={onError}
    />
    {file && report && fileState === "Uploaded" && (
      <UploadPreview
        fileName={file.name}
        records={records}
        selectedKeys={selectedKeys}
        report={report}
        noun={label}
        onToggle={onToggleRecord}
        onRemoveFile={onRemove}
      />
    )}
  </div>;
}