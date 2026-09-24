import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useCreateAudience, useUpdateAudience, useAudiences, AudienceInput, AudienceUpdate, type Audience } from "../api";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { GeoPlannerFilters } from "../api";
import { FiberModal, FiberInput, FiberTextarea, FiberGhostButton } from "./FiberModal";
import { FiberButton } from "./primitives";
import { Link } from "wouter";

interface SaveAudienceV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  geography: {
    points: Array<{ lat: number; lng: number; postcode?: string; city?: string }>;
    coverage: string;
  };
  filters: GeoPlannerFilters;
  version?: string;
  onSuccess?: (audience: Audience) => void;
}

export function SaveAudienceV2({ open, onOpenChange, editId, geography, filters, version: versionProp, onSuccess }: SaveAudienceV2Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saveError, setSaveError] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const version = versionProp || new URLSearchParams(search).get("version") || "v2";
  const encodedVersion = encodeURIComponent(version);

  const audiencesQuery = useAudiences();
  const { mutateAsync: createAudience, isPending: isCreating } = useCreateAudience();
  const { mutateAsync: updateAudience, isPending: isUpdating } = useUpdateAudience();
  const isPending = isCreating || isUpdating;

  const initializedId = useRef<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setSaveError("");
      if (editId && audiencesQuery.data) {
        if (initializedId.current !== editId) {
          const audience = audiencesQuery.data.find(a => a.id === editId);
          if (audience) {
            setName(audience.name);
            setDescription(audience.description || "");
            initializedId.current = editId;
          }
        }
      } else if (!editId && initializedId.current !== "NEW") {
        setName("");
        setDescription("");
        initializedId.current = "NEW";
      }
    } else {
      initializedId.current = null;
    }
  }, [open, editId, audiencesQuery.data]);

  const duplicate = !!audiencesQuery.data?.some(
    a => a.id !== editId && a.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  
  const similar = !duplicate && !!audiencesQuery.data?.some(
    a => a.id !== editId && 
    (a.name.trim().toLowerCase().startsWith(name.trim().toLowerCase() + '-') || 
     name.trim().toLowerCase().startsWith(a.name.trim().toLowerCase() + '-'))
  );

  const formatValid = /^[A-Za-z0-9-]+$/.test(name);
  let validationError = "";
  if (name.length > 0) {
    if (name.length < 5) validationError = "Use at least 5 characters.";
    else if (name.length > 50) validationError = "Use no more than 50 characters.";
    else if (!formatValid) validationError = "Only letters, numbers, and hyphens are allowed.";
  }

  const isValid = name.length >= 5 && name.length <= 50 && formatValid;
  const isExactDuplicate = duplicate && !editId;

  const handleSave = async () => {
    if (!isValid || savingRef.current || isPending) return;
    savingRef.current = true;
    setSaveError("");
    
    const data: AudienceInput = {
      name: name.trim(),
      description: description.trim(),
      plannerVersion: 'v2',
      plannerFilters: filters,
      geoType: "points",
      geoDefinition: {
        points: geography.points,
        coverage: geography.coverage,
      },
      coverage: geography.coverage,
      allowDuplicate: isExactDuplicate ? true : undefined,
    };

    try {
      if (editId) {
        if (!audiencesQuery.data?.find(a => a.id === editId)) {
          throw new Error("The audience could not be found. Retry loading it before saving.");
        }
        const result = await updateAudience({ id: editId, data: data as AudienceUpdate });
        toast({ 
          title: "Audience updated", 
          description: `${data.name} has been updated successfully.` 
        });
        onSuccess?.(result);
      } else {
        const result = await createAudience({ ...data, createdBy: "Demo user" });
        toast({ 
          title: "Saved to library", 
          description: (
            <div className="flex flex-col gap-2 mt-1">
              <div>{result.name || data.name} contains {geography.points.length} saved locations.</div>
              <Link href={`/dooh-planner?version=${encodedVersion}&audience=${encodeURIComponent(result.id)}`} className="text-[var(--dooh-purple)] underline font-medium hover:text-[#400047]">
                Plan DOOH with this audience
              </Link>
            </div>
          )
        });
        if (onSuccess) {
          onSuccess(result);
        } else {
          setLocation(`/geo-planner?version=${encodedVersion}&edit=${encodeURIComponent(result.id)}`);
        }
      }
      onOpenChange(false);
    } catch (error: any) {
      const message = error?.message || "Audience could not be saved.";
      setSaveError(message);
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      savingRef.current = false;
    }
  };

  const footer = (
    <>
      <FiberGhostButton onClick={() => onOpenChange(false)} disabled={isPending}>
        Cancel
      </FiberGhostButton>
      <FiberButton onClick={handleSave} disabled={!isValid || isPending} loading={isPending}>
        {isExactDuplicate ? "Confirm new version" : "Confirm"}
      </FiberButton>
    </>
  );

  return (
    <FiberModal 
      open={open} 
      onOpenChange={(nextOpen) => { if (!savingRef.current) onOpenChange(nextOpen); }}
      busy={isPending}
      description="Save your submitted filters, intelligence selections, and geographic results so you can reuse this audience in the DOOH Saved Audience dropdown."
      title={editId ? "Update Audience" : "Save Audience"}
      footer={footer}
    >
      <div className="flex flex-1 items-start relative mb-4">
        <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] min-w-px text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {editId ? "Update this saved audience with your submitted filters, intelligence selections, and geographic results." : "Save your submitted filters, intelligence selections, and geographic results as a reusable audience."}{" "}
          You can then select it from Saved Audience in DOOH planning.
        </p>
      </div>

      <div className="w-full space-y-4">
        <div className="w-full">
          <label htmlFor="audience-name" className="text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)] mb-[var(--spacing-50,4px)] block" style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>
            Audience Name *
          </label>
          <FiberInput 
            id="audience-name" 
            value={name} 
            maxLength={50} 
            onChange={e => { setName(e.target.value); setSaveError(""); }} 
            placeholder="e.g. Cinema-Goers-London" 
            aria-invalid={!!validationError} 
            error={!!validationError}
            disabled={isPending}
          />
          <div className="flex justify-between gap-3 mt-1 text-[11px] leading-snug">
            <span className={validationError ? "text-[var(--surface-foreground-static-error,#da294b)]" : "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]"}>
              {validationError || "5–50 characters; letters, numbers, and hyphens only."}
            </span>
            <span className={name.length > 50 ? "text-[var(--surface-foreground-static-error,#da294b)]" : "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]"}>
              {name.length}/50
            </span>
          </div>
        </div>
        
        <div className="w-full">
          <label htmlFor="audience-desc" className="text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)] mb-[var(--spacing-50,4px)] block" style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>
            Description (Optional)
          </label>
          <FiberTextarea 
            id="audience-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. High-income cinema-goers in Central London"
            maxLength={200}
            rows={3}
            disabled={isPending}
          />
          <div className="flex justify-end mt-1 text-[11px] leading-snug text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
            {description.length}/200
          </div>
        </div>

        {isExactDuplicate && (
          <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-warning-default,#ffc000)] bg-[var(--surface-background-lvl1,#ffffff)] p-4 shadow-sm w-full mt-2">
            <div className="flex w-full items-start gap-2 shrink-0">
              <div className="flex flex-1 flex-col items-start min-w-px">
                <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full">
                  Warning
                </p>
                <p className="[word-break:break-word] mt-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                  An audience with this name already exists. Confirming will create a new version (e.g. {name}-v2).
                </p>
              </div>
            </div>
          </div>
        )}
        {similar && (
          <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[var(--radiuses-small,2px)] border border-solid border-[#4facfe] bg-[var(--surface-background-lvl1,#ffffff)] p-4 shadow-sm w-full mt-2">
            <div className="flex w-full items-start gap-2 shrink-0">
              <div className="flex flex-1 flex-col items-start min-w-px">
                <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full">
                  Advisory
                </p>
                <p className="[word-break:break-word] mt-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                  A similarly named audience already exists. Consider using a distinct name.
                </p>
              </div>
            </div>
          </div>
        )}
        {duplicate && editId && (
          <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-warning-default,#ffc000)] bg-[var(--surface-background-lvl1,#ffffff)] p-4 shadow-sm w-full mt-2">
            <div className="flex w-full items-start gap-2 shrink-0">
              <div className="flex flex-1 flex-col items-start min-w-px">
                <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full">
                  Warning
                </p>
                <p className="[word-break:break-word] mt-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                  Another audience already uses this name. This may fail unless the name is changed.
                </p>
              </div>
            </div>
          </div>
        )}

        {saveError && (
          <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-error-default,#da294b)] bg-[var(--surface-background-lvl1,#ffffff)] p-4 shadow-sm w-full mt-2">
            <div className="flex w-full items-center gap-2 shrink-0">
              <div className="flex flex-1 flex-col items-start min-w-px">
                <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full">
                  Error
                </p>
                <p className="[word-break:break-word] mt-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                  {saveError}
                </p>
                <button type="button" onClick={handleSave} className="mt-2 text-[var(--surface-foreground-static-error,#da294b)] underline font-medium text-sm">
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FiberModal>
  );
}
