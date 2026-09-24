import { Download } from "lucide-react";
import { FiberDropZone } from "@/components/FiberDropZone";
import { MOCK_POSTCODES } from "../data";
import type { UploadReport } from "../uploadHelpers";
import { FiberButton } from "./primitives";
import { UploadPreview, type UploadPreviewRecord } from "./UploadPreview";

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
    {file && report && fileState === "Uploaded" && (
      <UploadPreview
        fileName={file.name}
        records={records}
        selectedKeys={selectedKeys}
        report={report}
        noun={label}
        selectionOnly
        onToggle={onToggleRecord}
        onRemoveFile={onRemove}
      />
    )}
    <FiberDropZone
      accept=".csv,text/csv"
      acceptLabel="Only .csv files supported"
      file={file}
      fileState={fileState}
      onFileSelect={onSelect}
      onFileRemove={onRemove}
      onFileError={onError}
    />
    <FiberButton variant="outline" size="compact" className="w-full" ariaLabel={`Download ${method === "postcode" ? "postcode" : "latitude and longitude"} sample CSV`} onClick={() => downloadSample(method)}>
      <Download size={14} aria-hidden />Download sample CSV
    </FiberButton>
  </div>;
}