import React, { useState, useRef, DragEvent, KeyboardEvent } from "react";
import { FileSpreadsheet } from "lucide-react";

const ASSET = "/figmaAssets/drop-zone";
const imgFilePdf = `${ASSET}/file-pdf.svg`;
const imgFilePdfUploaded = `${ASSET}/file-pdf-uploaded.svg`;
const imgCircleNotch = `${ASSET}/circle-notch.svg`;
const imgIconX = `${ASSET}/icon-x.svg`;
const imgIconTrash = `${ASSET}/icon-trash.svg`;
const imgDivider = `${ASSET}/divider.svg`;
const imgFolder = `${ASSET}/folder.png`;
const imgPointing = `${ASSET}/pointing.svg`;

export type DropZoneState = "Default" | "File uploads" | "Uploads";

export interface FiberDropZoneProps {
  accept?: string;
  acceptLabel?: string;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  onFileError?: (error: string) => void;
  file?: File | null;
  fileState?: "Uploading" | "Uploaded";
  
  // For playground / design overrides
  forceState?: DropZoneState;
  forceHover?: boolean;
}

export function UploadedFile({
  className,
  fileState = "Uploading",
  filename = "Filename.pdf",
  onRemove,
  isPlayground = false,
}: {
  className?: string;
  fileState?: "Uploading" | "Uploaded";
  filename?: string;
  onRemove?: (e: React.MouseEvent) => void;
  isPlayground?: boolean;
}) {
  const isUploaded = fileState === "Uploaded";
  const [hoverBtn, setHoverBtn] = useState(false);
  const [focusBtn, setFocusBtn] = useState(false);

  return (
    <div
      className={
        className ||
        "flex w-full items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
      }
    >
      {/* Icon/file */}
      <div className="relative flex size-[20px] shrink-0 items-center justify-center overflow-clip p-[2px]">
        <div className="relative h-[15.001px] w-[14.376px] shrink-0 text-gray-500">
          {isPlayground ? (
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isUploaded ? imgFilePdfUploaded : imgFilePdf}
            />
          ) : (
            <FileSpreadsheet className="absolute inset-0 block size-full max-w-none stroke-[1.5]" />
          )}
        </div>
      </div>
      <div className="relative flex min-w-0 flex-1 items-center gap-[var(--spacing-150,12px)]">
        <p
          className={`min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans',Helvetica] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] [word-break:break-word] ${
            isUploaded
              ? "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]"
              : "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]"
          }`}
        >
          {filename}
        </p>
        <div className="relative flex shrink-0 items-center gap-[var(--spacing-150,12px)]">
          <div className="relative flex shrink-0 items-center gap-[var(--spacing-100,8px)]">
            {!isUploaded && (
              <div className="relative flex size-[20px] shrink-0 items-center justify-center">
                <div className={`relative size-[20px] shrink-0 ${!isPlayground ? "animate-spin" : ""}`}>
                  <img
                    alt="Pending spinner"
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgCircleNotch}
                  />
                </div>
              </div>
            )}
            <p className="relative shrink-0 overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans',Helvetica] text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] [word-break:break-word]">
              {isPlayground ? (isUploaded ? "45 MB" : "2 mins remaining (22%)") : (isUploaded ? "Done" : "Pending...")}
            </p>
          </div>
          {/* Icon Buttons */}
          <button
            type="button"
            onClick={onRemove}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            onFocus={() => setFocusBtn(true)}
            onBlur={() => setFocusBtn(false)}
            aria-label={isUploaded ? "Remove file" : "Cancel upload"}
            style={{
              backgroundColor: hoverBtn ? "var(--surface-background-hover,#7171801a)" : "transparent",
              boxShadow: focusBtn ? "0 0 0 2px var(--border-dynamic-brand-selected,#7c33b5)" : "none"
            }}
            className="relative flex shrink-0 items-center rounded-[var(--radius-25,2px)] p-[2px] outline-none transition-colors duration-150"
          >
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
          </button>
        </div>
      </div>
    </div>
  );
}

export function FiberDropZone({
  accept = ".csv",
  acceptLabel = "(Only .csv files supported)",
  onFileSelect,
  onFileRemove,
  onFileError,
  file,
  fileState,
  forceState,
  forceHover,
}: FiberDropZoneProps) {
  const [realHover, setRealHover] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const hover = forceHover ?? (realHover || isDragOver);
  
  let effectiveState: DropZoneState = "Default";
  if (forceState) {
    effectiveState = forceState;
  } else if (file) {
    effectiveState = "Uploads";
  }

  const isDefaultAndHover = effectiveState === "Default" && hover;
  const isUploadsAndHover = effectiveState === "Uploads" && hover;
  const hasFiles = effectiveState === "File uploads" || effectiveState === "Uploads";
  const showHandCursor = isDefaultAndHover || isUploadsAndHover;

  const containerBorderColor =
    (effectiveState === "Default" && (hover || isFocused || isDragOver)) || (effectiveState === "Uploads" && (hover || isFocused || isDragOver))
      ? "var(--border-dynamic-brand-hover,#662994)"
      : "var(--border-dynamic-neutral-subtle-default,#c6c6cc)";

  const containerBgColor = "var(--surface-background-lvl1,#ffffff)";

  const containerPad = hasFiles
    ? "gap-[var(--spacing-300,24px)] pb-[var(--spacing-200,16px)] pt-[var(--spacing-300,24px)]"
    : "gap-[var(--spacing-0,0px)] py-[var(--spacing-300,24px)]";

  const handleFile = (selectedFile: File) => {
    if (inputRef.current) inputRef.current.value = "";
    const acceptedExtensions = accept
      .split(",")
      .map(value => value.trim().toLowerCase())
      .filter(value => value.startsWith("."));
    if (acceptedExtensions.length > 0 && !acceptedExtensions.some(extension => selectedFile.name.toLowerCase().endsWith(extension))) {
      const extensionLabel = acceptedExtensions.join(" or ");
      onFileError?.(`Please select a supported file type (${extensionLabel}).`);
      return;
    }
    onFileError?.("");
    onFileSelect?.(selectedFile);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!hasFiles) setIsDragOver(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!hasFiles && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (!hasFiles) inputRef.current?.click();
    }
  };

  return (
    <div
      role={hasFiles ? "presentation" : "button"}
      aria-label={hasFiles ? undefined : "Upload file or drag and drop"}
      onMouseEnter={() => setRealHover(true)}
      onMouseLeave={() => setRealHover(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => { if (!hasFiles) inputRef.current?.click(); }}
      onKeyDown={handleKeyDown}
      tabIndex={hasFiles ? -1 : 0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        cursor: (!hasFiles && hover) ? "pointer" : "default",
        borderColor: containerBorderColor,
        backgroundColor: containerBgColor,
      }}
      className={`relative flex w-full flex-col items-center rounded-[var(--radius-25,2px)] border border-dashed px-[var(--spacing-200,16px)] transition-colors duration-150 focus:outline-none ${containerPad}`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Upload text */}
      <div className="relative flex w-full shrink-0 items-center justify-center">
        <div className="relative shrink-0 text-center font-['DM_Sans',Helvetica] leading-[0] not-italic text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full max-w-[556px]">
          <p className="mb-0 text-[length:var(--body-md-medium-size,14px)]">
            <span
              style={{
                color: hover && (effectiveState === "Default" || effectiveState === "Uploads")
                  ? "var(--surface-foreground-dynamic-brand-hover,#662994)"
                  : "var(--surface-foreground-dynamic-brand-default,#7c33b5)"
              }}
              className="font-medium leading-[var(--body-md-medium-line-height,20px)] [word-break:break-word]"
            >
              Upload a file
            </span>
            <span className="leading-[var(--body-md-medium-line-height,20px)]"> </span>
            <span className="font-medium leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] [word-break:break-word]">
              or drag and drop
            </span>
          </p>
          <p className="font-normal leading-[var(--body-sm-regular-line-height,18px)] text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
            {acceptLabel}
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
          <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--spacing-150,12px)]">
             {forceState === "File uploads" || forceState === "Uploads" ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <UploadedFile key={i} isPlayground />
               ))
             ) : file ? (
               <UploadedFile
                 filename={file.name}
                 fileState={fileState}
                 onRemove={(e) => {
                   e.stopPropagation();
                   onFileRemove?.();
                   if (inputRef.current) inputRef.current.value = "";
                 }}
               />
             ) : null}
          </div>
        </>
      )}

      {forceState && showHandCursor && (
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
