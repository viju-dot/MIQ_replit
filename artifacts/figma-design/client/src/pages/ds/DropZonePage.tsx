import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";
import { FiberDropZone, UploadedFile, type DropZoneState } from "@/components/FiberDropZone";

const dropZoneConfig: PlaygroundConfig = {
  name: "Drop Zone",
  scopeId: "drop-zone/drop-zone",
  description:
    "File upload drop zone — supports empty, file-listing, and hover states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "File uploads", "Uploads"],
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "hover", label: "Hover", defaultValue: false },
  ],
  render: (props) => (
    <div className="w-full max-w-[588px]">
      <FiberDropZone
        forceState={props.state as DropZoneState}
        forceHover={props.hover === true}
        acceptLabel="(Only .xls .xlsx .csv files supported)"
      />
    </div>
  ),
  tokens: {
    "border/dynamic/brand/hover": "var(--border-dynamic-brand-hover)",
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/brand/hover":
      "var(--surface-foreground-dynamic-brand-hover)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3":
      "var(--surface-foreground-static-neutral-lvl3)",
    "radius/25": "var(--radius-25)",
  },
};

const uploadedFileConfig: PlaygroundConfig = {
  name: "Uploaded files",
  scopeId: "drop-zone/uploaded-files",
  description:
    "File row shown inside the drop zone — uploading (progress) and uploaded (done) states.",
  controls: [
    {
      kind: "select",
      name: "fileState",
      label: "File state",
      options: ["Uploading", "Uploaded"],
      defaultValue: "Uploading",
      asTabs: true,
    },
    {
      kind: "text",
      name: "filename",
      label: "Filename",
      defaultValue: "Filename.pdf",
      placeholder: "Filename.pdf",
    },
  ],
  render: (props) => (
    <div className="w-full max-w-[556px]">
      <UploadedFile
        fileState={props.fileState as "Uploading" | "Uploaded"}
        filename={String(props.filename)}
        isPlayground
      />
    </div>
  ),
  tokens: {
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3":
      "var(--surface-foreground-static-neutral-lvl3)",
    "radius/50": "var(--radius-50)",
  },
};

export default function DropZonePage() {
  return (
    <section
      aria-label="Drop zone components"
      className="flex flex-col gap-6 font-['DM_Sans',Helvetica]"
    >
      <Playground config={dropZoneConfig} />
      <Playground config={uploadedFileConfig} />
    </section>
  );
}
