const imgPersonaPicture = "/figmaAssets/persona-cards/persona-picture.png";
const imgGenderMale = "/figmaAssets/persona-cards/icon-gender-male.svg";
const imgMoney = "/figmaAssets/persona-cards/icon-money.svg";
const imgIdCard = "/figmaAssets/persona-cards/icon-id-card.svg";

function Badge({ label }: { label: string }) {
  return (
    <div className="flex items-center shrink-0">
      <div className="flex gap-[10px] items-start shrink-0">
        <div className="bg-[#ebebf0] flex gap-[2px] h-[18px] items-center justify-center px-[3px] py-0 relative rounded-[2px] shrink-0">
          <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#4b4b59] text-center whitespace-nowrap">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, badges }: { label: string; badges: string[] }) {
  return (
    <div className="content-center flex flex-wrap gap-[8px] items-center relative shrink-0 w-full">
      <div className="flex items-center shrink-0">
        <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
          {label}
        </p>
      </div>
      {badges.map((b) => (
        <Badge key={b} label={b} />
      ))}
    </div>
  );
}

function PersonaCard() {
  return (
    <div
      className="bg-white flex items-start min-w-[180px] overflow-clip relative rounded-[2px] shrink-0 w-full"
      style={{
        boxShadow:
          "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
      }}
      data-name="Smart Card"
    >
      <div className="flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Master Card">
        <div className="flex flex-col gap-[8px] items-start p-[16px] relative shrink-0 w-full" data-name="Content">
          <div className="flex gap-[16px] items-start relative shrink-0 w-full" data-name="Persona Card - Content Container">
            <div className="flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-name="Content Container">
              {/* Persona picture */}
              <div className="h-[140px] relative shrink-0 w-[115px]" data-name="Persona picture">
                <img
                  alt="Rohan Patel persona"
                  className="absolute inset-0 max-w-none object-cover pointer-events-none size-full rounded-[2px]"
                  src={imgPersonaPicture}
                />
              </div>
              {/* Persona info */}
              <div className="flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-name="Persona Info Container">
                <div className="flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative self-stretch" data-name="Left Text Container">
                  {/* Name */}
                  <div className="flex gap-[8px] items-start justify-center relative shrink-0 w-full">
                    <div className="flex flex-[1_0_0] gap-[8px] items-start min-w-px relative">
                      <p className="[word-break:break-word] font-medium leading-[20px] not-italic text-[14px] text-[#13131a] whitespace-nowrap">
                        Rohan Patel
                      </p>
                    </div>
                  </div>

                  {/* Demographics row: gender / income / age */}
                  <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
                    {/* Gender */}
                    <div className="flex gap-[4px] items-center relative shrink-0">
                      <div className="flex items-center justify-center relative shrink-0 size-[16px]">
                        <img alt="" className="block size-[16px]" src={imgGenderMale} />
                      </div>
                      <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        Gender:
                      </p>
                      <p className="[word-break:break-word] font-normal leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        Male
                      </p>
                    </div>
                    {/* Income */}
                    <div className="flex gap-[4px] items-center relative shrink-0">
                      <div className="flex flex-col items-center justify-center overflow-clip px-px py-[4px] relative shrink-0 size-[16px]">
                        <div className="h-[9px] relative shrink-0 w-[15px]">
                          <img alt="" className="block size-full" src={imgMoney} />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        Income:
                      </p>
                      <p className="[word-break:break-word] font-normal leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        £60,000-£70,000
                      </p>
                    </div>
                    {/* Age */}
                    <div className="flex gap-[4px] items-center relative shrink-0">
                      <div className="flex flex-col items-center justify-center px-[2px] py-[3px] relative shrink-0 size-[16px]">
                        <div className="h-[11px] relative shrink-0 w-[13px]">
                          <img alt="" className="block size-full" src={imgIdCard} />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        Age:
                      </p>
                      <p className="[word-break:break-word] font-normal leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
                        34
                      </p>
                    </div>
                  </div>

                  <DataRow
                    label="Watching:"
                    badges={["Glow Up: Britain's Next Make-Up Star", "The Real Housewives", "+1 more"]}
                  />
                  <DataRow
                    label="Browsing:"
                    badges={[
                      "Tennis techniques",
                      "London restaurant reviews",
                      "Art exhibitions",
                      "+2 more",
                    ]}
                  />
                  <DataRow
                    label="Buying:"
                    badges={["Nike", "Adidas", "Lacoste", "+2 more"]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PersonaCardsPage() {
  return (
    <section className="flex flex-col gap-6" aria-label="Persona cards">
      {/* Persona card component - single variant */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-[#a8a8b2]">Persona card — Default</span>
          <div className="max-w-[900px] w-full">
            <PersonaCard />
          </div>
        </div>
      </div>
    </section>
  );
}
