import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type FieldVariant = {
  id: string;
  disabled?: boolean;
  checked?: boolean;
  hasCaret?: boolean;
  hasCheckbox?: boolean;
  backgroundClass?: string;
  textClass?: string;
};

const fieldVariants: FieldVariant[] = [
  { id: "default-text" },
  { id: "default-caret", hasCaret: true },
  { id: "default-checkbox", hasCheckbox: true },
  { id: "default-checkbox-caret", hasCheckbox: true, hasCaret: true },
  { id: "disabled-text", disabled: true, textClass: "text-[#a8a8b2]" },
  {
    id: "disabled-caret",
    disabled: true,
    hasCaret: true,
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "disabled-checkbox",
    disabled: true,
    hasCheckbox: true,
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "disabled-checkbox-caret",
    disabled: true,
    hasCheckbox: true,
    hasCaret: true,
    textClass: "text-[#a8a8b2]",
  },
  { id: "hover-text", backgroundClass: "bg-[#71718014]" },
  {
    id: "hover-caret",
    hasCaret: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "hover-checkbox",
    hasCheckbox: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "hover-checkbox-caret",
    hasCheckbox: true,
    hasCaret: true,
    backgroundClass: "bg-[#71718014]",
  },
  {
    id: "selected-text",
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-caret",
    hasCaret: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-checkbox",
    hasCheckbox: true,
    checked: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-checkbox-caret",
    hasCheckbox: true,
    hasCaret: true,
    checked: true,
    backgroundClass: "bg-[#f6ebff]",
    textClass: "text-[#7c33b5]",
  },
  {
    id: "selected-disabled-checkbox",
    disabled: true,
    hasCheckbox: true,
    checked: true,
    backgroundClass: "bg-[#7171801a]",
    textClass: "text-[#a8a8b2]",
  },
  {
    id: "selected-disabled-checkbox-caret",
    disabled: true,
    hasCheckbox: true,
    hasCaret: true,
    checked: true,
    backgroundClass: "bg-[#7171801a]",
    textClass: "text-[#a8a8b2]",
  },
];

export const Box = (): JSX.Element => {
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
    <main className="h-[290px] w-[1933px]" aria-label="Field state examples">
      <section className="fixed left-[-2003px] top-[-914px] flex w-[1933px] flex-wrap items-start gap-[30px] rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        {fieldVariants.map((field) => (
          <article
            key={field.id}
            className={`flex w-[276px] items-center gap-2 border-b border-[#e1e1e8] px-3 py-2 ${
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
        ))}

        <section className="flex w-[276px] items-start border-b border-[#e1e1e8] py-2.5">
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
        <article className="flex w-[276px] items-center gap-2 border-b border-[#e1e1e8] bg-[#7171801a] px-3 py-2">
          <span className="flex h-6 items-center font-body-md-regular text-[length:var(--body-md-regular-font-size)] font-[number:var(--body-md-regular-font-weight)] leading-[var(--body-md-regular-line-height)] tracking-[var(--body-md-regular-letter-spacing)] text-[#a8a8b2]">
            Loading...
          </span>
        </article>
      </section>
    </main>
  );
};
