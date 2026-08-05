import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type FieldVariant = {
  id: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  hasCaret?: boolean;
  hasCheckbox?: boolean;
  backgroundClass?: string;
  textClass?: string;
};

const fieldVariants: FieldVariant[] = [
  { id: "default-text", label: "Default" },
  { id: "default-caret", label: "Default + Caret", hasCaret: true },
  { id: "default-checkbox", label: "Default + Checkbox", hasCheckbox: true },
  { id: "default-checkbox-caret", label: "Default + Checkbox + Caret", hasCheckbox: true, hasCaret: true },
  { id: "disabled-text", label: "Disabled", disabled: true, textClass: "text-[#a8a8b2]" },
  {
    id: "disabled-caret",
    label: "Disabled + Caret",
    disabled: true,
    hasCaret: true,
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "disabled-checkbox",
    label: "Disabled + Checkbox",
    disabled: true,
    hasCheckbox: true,
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "disabled-checkbox-caret",
    label: "Disabled + Checkbox + Caret",
    disabled: true,
    hasCheckbox: true,
    hasCaret: true,
    textClass: "text-[#a8a8b2]",
  },
  { id: "hover-text", label: "Hover", backgroundClass: "bg-[#71718014]" },
  {
    id: "hover-caret",
    label: "Hover + Caret",
    hasCaret: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "hover-checkbox",
    label: "Hover + Checkbox",
    hasCheckbox: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "hover-checkbox-caret",
    label: "Hover + Checkbox + Caret",
    hasCheckbox: true,
    hasCaret: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "selected-text",
    label: "Selected",
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-caret",
    label: "Selected + Caret",
    hasCaret: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-checkbox",
    label: "Selected + Checkbox",
    hasCheckbox: true,
    checked: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-checkbox-caret",
    label: "Selected + Checkbox + Caret",
    hasCheckbox: true,
    hasCaret: true,
    checked: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-disabled-checkbox",
    label: "Selected Disabled + Checkbox",
    disabled: true,
    hasCheckbox: true,
    checked: true,
    backgroundClass: "bg-[#7171801a]",
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "selected-disabled-checkbox-caret",
    label: "Selected Disabled + Checkbox + Caret",
    disabled: true,
    hasCheckbox: true,
    hasCaret: true,
    checked: true,
    backgroundClass: "bg-[#7171801a]",
    textClass: "text-[#a8a8b2]",
  },
];

export default function Dropdowns(): JSX.Element {
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>(
    () =>
      fieldVariants.reduce<Record<string, boolean>>((fields, field) => {
        if (field.hasCheckbox) {
          fields[field.id] = field.checked ?? false;
        }
        return fields;
      }, {}),
  );

  const selectableFields = fieldVariants.filter(
    (field) => field.hasCheckbox && !field.disabled,
  );
  const allSelected = selectableFields.every(
    (field) => checkedFields[field.id],
  );

  const setAllFields = (checked: boolean) => {
    setCheckedFields((currentFields) =>
      selectableFields.reduce<Record<string, boolean>>(
        (nextFields, field) => ({
          ...nextFields,
          [field.id]: checked,
        }),
        currentFields,
      ),
    );
  };

  return (
    <section aria-label="Dropdown row states">
      {/* Field states grid */}
      <div
        className="flex max-w-5xl flex-wrap gap-[30px] rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5"
      >
        {fieldVariants.map((field) => (
          <div key={field.id} className="flex flex-col gap-1">
            {/* State label */}
            <span className="font-body-sm-regular text-[length:var(--body-sm-regular-font-size)] font-[number:var(--body-sm-regular-font-weight)] leading-[var(--body-sm-regular-line-height)] text-[#a8a8b2] px-1">
              {field.label}
            </span>
            {/* Field row */}
            <article
              className={`flex w-full max-w-[276px] items-center gap-2 border-b border-[#e1e1e8] px-3 py-2 ${
                field.hasCheckbox ? "pl-2" : ""
              } ${field.backgroundClass ?? ""}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5">
                  {field.hasCheckbox && (
                    <Checkbox
                      id={field.id}
                      checked={checkedFields[field.id]}
                      disabled={field.disabled}
                      onCheckedChange={(checked) =>
                        setCheckedFields((currentFields) => ({
                          ...currentFields,
                          [field.id]: checked === true,
                        }))
                      }
                      aria-label="Field 1"
                      className="h-4 w-4 shrink-0 rounded-sm border-[1.5px] border-[#c6c6cc] data-[state=checked]:border-[#7c33b5] data-[state=checked]:bg-[#7c33b5] disabled:border-[#c6c6cc] disabled:opacity-100 data-[state=checked]:disabled:border-transparent data-[state=checked]:disabled:bg-[#7171801a]"
                    />
                  )}
                  <label
                    htmlFor={field.hasCheckbox ? field.id : undefined}
                    className={`flex items-center whitespace-nowrap font-body-md-regular text-[length:var(--body-md-regular-font-size)] font-[number:var(--body-md-regular-font-weight)] leading-[var(--body-md-regular-line-height)] tracking-[var(--body-md-regular-letter-spacing)] ${
                      field.textClass ?? "text-[#13131a]"
                    }`}
                  >
                    Field 1
                  </label>
                </div>
                {field.hasCaret && (
                  <img
                    className="h-6 w-6 shrink-0"
                    alt="Icon caret"
                    src="/figmaAssets/icon-caret.svg"
                  />
                )}
              </div>
            </article>
          </div>
        ))}

        {/* Select All / Clear All control */}
        <div className="flex flex-col gap-1">
          <span className="font-body-sm-regular text-[length:var(--body-sm-regular-font-size)] font-[number:var(--body-sm-regular-font-weight)] leading-[var(--body-sm-regular-line-height)] text-[#a8a8b2] px-1">
            Controls
          </span>
          <section className="flex w-full max-w-[276px] items-start border-b border-[#e1e1e8] py-2.5">
            <div className="flex w-full items-start justify-between px-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAllFields(true)}
                className="h-auto p-0 font-body-md-medium text-[length:var(--body-md-medium-font-size)] font-[number:var(--body-md-medium-font-weight)] leading-[var(--body-md-medium-line-height)] tracking-[var(--body-md-medium-letter-spacing)] text-[#7c33b5] hover:bg-transparent hover:text-[#7c33b5]"
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAllFields(false)}
                disabled={!allSelected}
                className="h-auto p-0 font-body-md-medium text-[length:var(--body-md-medium-font-size)] font-[number:var(--body-md-medium-font-weight)] leading-[var(--body-md-medium-line-height)] tracking-[var(--body-md-medium-letter-spacing)] text-[#a8a8b2] hover:bg-transparent hover:text-[#a8a8b2] disabled:opacity-100"
              >
                Clear all
              </Button>
            </div>
          </section>
        </div>

        {/* Loading state */}
        <div className="flex flex-col gap-1">
          <span className="font-body-sm-regular text-[length:var(--body-sm-regular-font-size)] font-[number:var(--body-sm-regular-font-weight)] leading-[var(--body-sm-regular-line-height)] text-[#a8a8b2] px-1">
            Loading
          </span>
          <article className="flex w-full max-w-[276px] items-center gap-2 border-b border-[#e1e1e8] bg-[#7171801a] px-3 py-2">
            <span className="flex h-6 items-center font-body-md-regular text-[length:var(--body-md-regular-font-size)] font-[number:var(--body-md-regular-font-weight)] leading-[var(--body-md-regular-line-height)] tracking-[var(--body-md-regular-letter-spacing)] text-[#a8a8b2]">
              Loading...
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
