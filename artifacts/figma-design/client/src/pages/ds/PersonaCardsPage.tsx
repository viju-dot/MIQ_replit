import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const imgPersonaPicture = "/figmaAssets/persona-cards/persona-picture.png";
const imgGenderMale = "/figmaAssets/persona-cards/icon-gender-male.svg";
const imgMoney = "/figmaAssets/persona-cards/icon-money.svg";
const imgIdCard = "/figmaAssets/persona-cards/icon-id-card.svg";

function parseBadges(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

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
  if (badges.length === 0) return null;
  return (
    <div className="content-center flex flex-wrap gap-[8px] items-center relative shrink-0 w-full">
      <div className="flex items-center shrink-0">
        <p className="[word-break:break-word] font-medium leading-[18px] not-italic text-[12px] text-[#13131a] whitespace-nowrap">
          {label}
        </p>
      </div>
      {badges.map((b, i) => (
        <Badge key={`${b}-${i}`} label={b} />
      ))}
    </div>
  );
}

function PersonaCard({
  name,
  gender,
  income,
  age,
  showDemographics,
  watching,
  browsing,
  buying,
}: {
  name: string;
  gender: string;
  income: string;
  age: string;
  showDemographics: boolean;
  watching: string[];
  browsing: string[];
  buying: string[];
}) {
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
                  alt={`${name} persona`}
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
                        {name}
                      </p>
                    </div>
                  </div>

                  {/* Demographics row: gender / income / age */}
                  {showDemographics && (
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
                          {gender}
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
                          {income}
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
                          {age}
                        </p>
                      </div>
                    </div>
                  )}

                  <DataRow label="Watching:" badges={watching} />
                  <DataRow label="Browsing:" badges={browsing} />
                  <DataRow label="Buying:" badges={buying} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Persona Card",
  description:
    "Smart card summarising an audience persona — picture, demographics, and interest badges. Edit the content below.",
  controls: [
    { kind: "text", name: "name", label: "Name", defaultValue: "Rohan Patel" },
    { kind: "boolean", name: "showDemographics", label: "Show demographics", defaultValue: true },
    { kind: "text", name: "gender", label: "Gender", defaultValue: "Male" },
    { kind: "text", name: "income", label: "Income", defaultValue: "£60,000-£70,000" },
    { kind: "text", name: "age", label: "Age", defaultValue: "34" },
    {
      kind: "text",
      name: "watching",
      label: "Watching (comma-separated)",
      defaultValue: "Glow Up: Britain's Next Make-Up Star, The Real Housewives, +1 more",
    },
    {
      kind: "text",
      name: "browsing",
      label: "Browsing (comma-separated)",
      defaultValue: "Tennis techniques, London restaurant reviews, Art exhibitions, +2 more",
    },
    {
      kind: "text",
      name: "buying",
      label: "Buying (comma-separated)",
      defaultValue: "Nike, Adidas, Lacoste, +2 more",
    },
  ],
  render: (props: PropValues) => (
    <div className="max-w-[900px] w-full">
      <PersonaCard
        name={String(props.name)}
        gender={String(props.gender)}
        income={String(props.income)}
        age={String(props.age)}
        showDemographics={props.showDemographics === true}
        watching={parseBadges(String(props.watching))}
        browsing={parseBadges(String(props.browsing))}
        buying={parseBadges(String(props.buying))}
      />
    </div>
  ),
  tokens: {
    "container/surface/background": "#ffffff",
    "container/neutral/badge/background": "#ebebf0",
    "text/heading/primary": "#13131a",
    "text/body/secondary": "#4b4b59",
    "radius/card": "2px",
    "radius/badge": "2px",
    "spacing/content/padding": "16px",
    "spacing/section/gap": "12px",
    "size/persona-picture": "115×140",
    "shadow/card":
      "0px 1px 4px rgba(113,113,128,0.08), 0px 8px 16px rgba(113,113,128,0.04)",
  },
};

export default function PersonaCardsPage() {
  return (
    <section className="flex flex-col gap-6" aria-label="Persona cards">
      <Playground config={config} />
    </section>
  );
}
