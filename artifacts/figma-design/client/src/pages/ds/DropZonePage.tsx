import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/drop-zone";

const imgFilePdf = `${ASSET}/file-pdf.svg`;
const imgFilePdfUploaded = `${ASSET}/file-pdf-uploaded.svg`;
const imgCircleNotch = `${ASSET}/circle-notch.svg`;
const imgIconX = `${ASSET}/icon-x.svg`;
const imgIconTrash = `${ASSET}/icon-trash.svg`;
const imgDivider = `${ASSET}/divider.svg`;
const imgFolder = `${ASSET}/folder.png`;
const imgPointing = `${ASSET}/pointing.svg`;

type FileState = "Uploading" | "Uploaded";

function UploadedFile({
  className,
  fileState = "Uploading",
  filename = "Filename.pdf",
}: {
  className?: string;
  fileState?: FileState;
  filename?: string;
}) {
  const isUploaded = fileState === "Uploaded";
  return (
    <div
      className={
        className ||
        "flex w-full items-center gap-2 rounded-[4px] border border-solid border-[#e1e1e8] bg-white px-3 py-2"
      }
    >
      {/* Icon/file-pdf */}
      <div className="relative flex size-[20px] shrink-0 items-center justify-center overflow-clip p-[2px]">
        <div className="relative h-[15.001px] w-[14.376px] shrink-0">
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={isUploaded ? imgFilePdfUploaded : imgFilePdf}
          />
        </div>
      </div>
      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <p
          className={`min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans',Helvetica] text-[14px] font-medium leading-[20px] [word-break:break-word] ${
            isUploaded ? "text-[#13131a]" : "text-[#717180]"
          }`}
        >
          {filename}
        </p>
        <div className="relative flex shrink-0 items-center gap-3">
          <div className="relative flex shrink-0 items-center gap-2">
            {!isUploaded && (
              <div className="relative flex size-[20px] shrink-0 items-center justify-center">
                <div className="relative size-[20px] shrink-0">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgCircleNotch}
                  />
                </div>
              </div>
            )}
            <p className="relative shrink-0 overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans',Helvetica] text-[14px] font-normal leading-[20px] text-[#13131a] [word-break:break-word]">
              {isUploaded ? "45 MB" : "2 mins remaining (22%)"}
            </p>
          </div>
          {/* Icon Buttons */}
          <div className="relative flex shrink-0 items-center rounded-[2px] p-[2px]">
            <div className="relative flex size-[20px] shrink-0 items-center justify-center p-[2px]">
              <div
                className={`relative shrink-0 ${
                  isUploaded ? "h-[16.25px] w-[15px]" : "size-[12.5px]"
                }`}
              >
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={isUploaded ? imgIconTrash : imgIconX}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DropZoneState = "Default" | "File uploads" | "Uploads";

function DropZone({
  hover = false,
  state = "Default",
}: {
  hover?: boolean;
  state?: DropZoneState;
}) {
  const isDefaultAndHover = state === "Default" && hover;
  const isFileUploadsAndNotHover = state === "File uploads" && !hover;
  const isUploadsAndHover = state === "Uploads" && hover;
  const hasFiles = isFileUploadsAndNotHover || isUploadsAndHover;
  const showHandCursor = isDefaultAndHover || isUploadsAndHover;

  const containerBorder =
    isDefaultAndHover || isUploadsAndHover
      ? "border-[#662994]"
      : "border-[#c6c6cc]";
  const containerPad = hasFiles ? "gap-6 pb-4 pt-6" : "gap-0 py-6";

  return (
    <div
      className={`relative flex w-full max-w-[588px] flex-col items-center rounded-[2px] border border-dashed bg-white px-4 ${containerBorder} ${containerPad}`}
    >
      {/* Upload text */}
      <div className="relative flex w-full shrink-0 items-center justify-center">
        <div
          className={`relative shrink-0 text-center font-['DM_Sans',Helvetica] leading-[0] not-italic text-[#13131a] ${
            isDefaultAndHover ? "w-full max-w-[556px]" : "whitespace-nowrap"
          }`}
        >
          <p className="mb-0 text-[14px]">
            <span
              className={`font-medium leading-[20px] [word-break:break-word] ${
                hover && (state === "Default" || state === "Uploads")
                  ? "text-[#662994]"
                  : "text-[#7c33b5]"
              }`}
            >
              Upload a file
            </span>
            <span className="leading-[20px]"> </span>
            <span className="font-medium leading-[20px] text-[#13131a] [word-break:break-word]">
              or drag and drop
            </span>
          </p>
          <p className="font-normal leading-[18px] text-[12px] text-[#717180]">
            (Only .xls .xlsx .csv files supported)
          </p>
        </div>
      </div>

      {hasFiles && (
        <>
          {/* Divider */}
          <div className="relative h-0 w-[100px] shrink-0">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block size-full max-w-none" src={imgDivider} />
            </div>
          </div>
          {/* Uploaded_Files */}
          <div className="relative flex w-full shrink-0 flex-col items-start gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <UploadedFile key={i} />
            ))}
          </div>
        </>
      )}

      {showHandCursor && (
        <>
          <div
            className="pointer-events-none absolute z-10 h-[38.63px] w-[49.081px] shadow-[0px_5px_5px_0px_rgba(0,0,0,0.2)]"
            style={
              isUploadsAndHover
                ? { left: "296px", top: "140px" }
                : { left: "50%", top: "42px" }
            }
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-0 top-0 size-full max-w-none"
                src={imgFolder}
              />
            </div>
          </div>
          <div
            className="pointer-events-none absolute z-10 size-[24px]"
            style={
              isUploadsAndHover
                ? { left: "320.08px", top: "160.31px" }
                : { left: "calc(50% + 24px)", top: "62.31px" }
            }
          >
            <div className="absolute inset-[18.28%_17.66%_17.94%_22.36%]">
              <div className="absolute inset-[-2.45%_-8.16%_-14.21%_-8.16%]">
                <img alt="" className="block size-full max-w-none" src={imgPointing} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const dropZoneConfig: PlaygroundConfig = {
  name: "Drop Zone",
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
    <DropZone
      state={props.state as DropZoneState}
      hover={props.hover === true}
    />
  ),
  tokens: {
    "border/brand/active": "#662994",
    "border/neutral/idle": "#c6c6cc",
    "text/brand/link": "#7c33b5",
    "text/brand/link/hover": "#662994",
    "text/neutral/strong": "#13131a",
    "text/neutral/muted": "#717180",
    "radius/container": "2px",
  },
};

const uploadedFileConfig: PlaygroundConfig = {
  name: "Uploaded files",
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
        fileState={props.fileState as FileState}
        filename={String(props.filename)}
      />
    </div>
  ),
  tokens: {
    "border/neutral/idle": "#e1e1e8",
    "text/neutral/strong": "#13131a",
    "text/neutral/muted": "#717180",
    "radius/row": "4px",
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
