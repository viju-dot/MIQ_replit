import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useCreateAudience, useUpdateAudience, useAudiences, Audience, AudienceInput, AudienceUpdate } from "../api";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { GeoPlannerFilters } from "../api";

interface SaveAudienceV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  geography: {
    points: Array<{ lat: number; lng: number; postcode?: string; city?: string }>;
    coverage: string;
  };
  filters: GeoPlannerFilters;
}

export function SaveAudienceV2({ open, onOpenChange, editId, geography, filters }: SaveAudienceV2Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saveError, setSaveError] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const audiencesQuery = useAudiences();
  const { mutateAsync: createAudience, isPending: isCreating } = useCreateAudience();
  const { mutateAsync: updateAudience, isPending: isUpdating } = useUpdateAudience();
  const isPending = isCreating || isUpdating;

  const initializedId = useRef<string | null>(null);

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
    if (!isValid) return;
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
        await updateAudience({ id: editId, data: data as AudienceUpdate });
        toast({ title: "Audience updated", description: `${data.name} has been updated successfully.` });
      } else {
        const result = await createAudience({ ...data, createdBy: "Demo user" });
        toast({ 
          title: "Saved to library", 
          description: `${result.name || data.name} contains ${geography.points.length} saved locations.` 
        });
      }
      onOpenChange(false);
      
      setLocation(`/saved-audiences?version=v2`);
    } catch (error: any) {
      const message = error?.message || "Audience could not be saved.";
      setSaveError(message);
      toast({ title: "Save failed", description: message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dooh-theme">
        <DialogHeader>
          <DialogTitle>{editId ? "Update Audience" : "Save Audience"}</DialogTitle>
          <DialogDescription>
            {editId ? "Update the details for this saved audience." : "Save this audience configuration to your library for DOOH planning."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="audience-name" className="text-sm font-medium mb-1.5 block">Audience Name *</label>
            <Input 
              id="audience-name" 
              value={name} 
              maxLength={50} 
              onChange={e => { setName(e.target.value); setSaveError(""); }} 
              placeholder="e.g. Cinema-Goers-London" 
              aria-invalid={!!validationError} 
              className={validationError ? "border-red-500 focus-visible:ring-red-500" : ""} 
            />
            <div className="flex justify-between gap-3 mt-1 text-xs">
              <span className={validationError ? "text-red-600" : "text-gray-500"}>
                {validationError || "5–50 characters; letters, numbers, and hyphens only."}
              </span>
              <span className={name.length > 50 ? "text-red-600" : "text-gray-500"}>
                {name.length}/50
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="audience-desc" className="text-sm font-medium mb-1.5 block">Description (Optional)</label>
            <Textarea 
              id="audience-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. High-income cinema-goers in Central London"
              maxLength={200}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end mt-1 text-xs text-gray-500">
              {description.length}/200
            </div>
          </div>

          {isExactDuplicate && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Warning: An audience with this name already exists. Saving will create a new version (e.g. {name}-v2).
            </div>
          )}
          {similar && (
            <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              Advisory: A similarly named audience already exists. Consider using a distinct name.
            </div>
          )}
          {duplicate && editId && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Warning: Another audience already uses this name. This may fail unless the name is changed.
            </div>
          )}

          {saveError && (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {saveError}
              <Button variant="link" className="h-auto p-0 ml-2 text-red-700 underline" onClick={handleSave}>
                Retry
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid || isPending} className="bg-[var(--dooh-purple)] hover:bg-[#400047] text-white">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isExactDuplicate ? "Save a new version" : (editId ? "Save changes" : "Save audience")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
