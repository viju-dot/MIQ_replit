const imgSelected = "/figmaAssets/radio/selected.svg";
const imgSelectedDisabled = "/figmaAssets/radio/selected-disabled.svg";
const imgUnselected = "/figmaAssets/radio/unselected.svg";
const imgUnselectedDisabled = "/figmaAssets/radio/unselected-disabled.svg";
const imgUnselectedDisabledLabel = "/figmaAssets/radio/unselected-disabled2.svg";

type RadioProps = {
  src: string;
  label?: boolean;
  disabled?: boolean;
};

function Radio({ src, label = false, disabled = false }: RadioProps) {
  if (!label) {
    return (
      <div className="relative size-[24px]">
        <div className="absolute left-0 size-[24px] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-[4px] items-center">
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute left-0 size-[24px] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
      <div
        className={`flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
          disabled ? "text-[#a8a8b2]" : "text-[#13131a]"
        }`}
        style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 400 }}
      >
        <p className="leading-[20px]">Option</p>
      </div>
    </div>
  );
}

const captionClass = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

export default function RadioPage() {
  return (
    <section className="flex flex-col gap-6" style={{ fontFamily: '"DM Sans", Helvetica' }}>
      {/* Radio only (no label) */}
      <div className={cardClass}>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Selected</span>
            <Radio src={imgSelected} />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Selected · Disabled</span>
            <Radio src={imgSelectedDisabled} />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Unselected</span>
            <Radio src={imgUnselected} />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Unselected · Disabled</span>
            <Radio src={imgUnselectedDisabled} />
          </div>
        </div>
      </div>

      {/* Radio with label */}
      <div className={cardClass}>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Selected · Label</span>
            <Radio src={imgSelected} label />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Unselected · Label</span>
            <Radio src={imgUnselected} label />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Unselected · Label · Disabled</span>
            <Radio src={imgUnselectedDisabledLabel} label disabled />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Selected · Label · Disabled</span>
            <Radio src={imgSelectedDisabled} label disabled />
          </div>
        </div>
      </div>

      {/* Radio group */}
      <div className={cardClass}>
        <div className="flex flex-col gap-2">
          <span className={captionClass}>Group</span>
          <div className="flex flex-col gap-[6px] items-start">
            <p
              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-[#13131a] whitespace-nowrap"
              style={{ fontWeight: 400 }}
            >
              Radio group title:
            </p>
            <Radio src={imgSelected} label />
            <Radio src={imgSelected} label />
            <Radio src={imgSelected} label />
          </div>
        </div>
      </div>
    </section>
  );
}
