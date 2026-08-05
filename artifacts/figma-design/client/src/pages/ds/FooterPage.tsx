type ButtonSize = "medium" | "small";

function LinkButton() {
  return (
    <div className="flex items-center gap-1 rounded-[2px] shrink-0">
      <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
        Link
      </p>
    </div>
  );
}

function OutlineButton({ size = "medium" }: { size?: ButtonSize }) {
  const pad = size === "small" ? "px-[6px] py-[2px]" : "px-[12px] py-[7px]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[2px] border border-solid border-[#4b4b59] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-[#4b4b59] text-center whitespace-nowrap">
          Default
        </p>
      </div>
    </div>
  );
}

function BrandButton({ size = "medium" }: { size?: ButtonSize }) {
  const pad = size === "small" ? "px-[6px] py-[2px]" : "px-[12px] py-[7px]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[2px] bg-[#7c33b5] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-white text-center whitespace-nowrap">
          Default
        </p>
      </div>
    </div>
  );
}

/** Footer - Page (Type=Default): ActionsLeft off, ActionsRight on by default */
function FooterPageBar({
  actionsLeft = false,
  actionsRight = true,
}: {
  actionsLeft?: boolean;
  actionsRight?: boolean;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between content-center relative w-full min-h-[66px] bg-white"
      style={{
        filter:
          "drop-shadow(0px -1px 2px rgba(113,113,128,0.12)) drop-shadow(0px -8px 8px rgba(113,113,128,0.08))",
      }}
    >
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-4 px-4 py-4 relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-4 px-4 py-4 relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton />
        </div>
      )}
    </div>
  );
}

/** Footer - Modal (IsCompact=No) */
function FooterModalDefault({
  actionsLeft = false,
  actionsRight = true,
}: {
  actionsLeft?: boolean;
  actionsRight?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between p-4 relative w-full min-h-[66px] bg-[#f7f7fa]">
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-4 relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-4 relative">
          <LinkButton />
          <BrandButton />
        </div>
      )}
    </div>
  );
}

/** Footer - Modal (IsCompact=Yes) */
function FooterModalCompact({
  actionsLeft = false,
  actionsRight = true,
}: {
  actionsLeft?: boolean;
  actionsRight?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between p-4 relative w-full min-h-[56px] bg-[#f7f7fa]">
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-4 relative">
          <LinkButton />
          <OutlineButton size="small" />
          <BrandButton size="small" />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-4 relative">
          <LinkButton />
          <BrandButton size="small" />
        </div>
      )}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

export default function FooterPage() {
  return (
    <section className="flex flex-col gap-6">
      {/* Footer - Page */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Caption>Type=Default · Actions Right</Caption>
            <FooterPageBar actionsLeft={false} actionsRight />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>Type=Default · Actions Left</Caption>
            <FooterPageBar actionsLeft actionsRight={false} />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>Type=Default · Actions Left + Right</Caption>
            <FooterPageBar actionsLeft actionsRight />
          </div>
        </div>
      </div>

      {/* Footer - Modal */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Caption>IsCompact=No · Actions Right</Caption>
            <FooterModalDefault actionsLeft={false} actionsRight />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>IsCompact=No · Actions Left + Right</Caption>
            <FooterModalDefault actionsLeft actionsRight />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>IsCompact=Yes · Actions Right</Caption>
            <FooterModalCompact actionsLeft={false} actionsRight />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>IsCompact=Yes · Actions Left + Right</Caption>
            <FooterModalCompact actionsLeft actionsRight />
          </div>
        </div>
      </div>
    </section>
  );
}
