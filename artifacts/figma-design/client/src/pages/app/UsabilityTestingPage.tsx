/* =========================================================================
 * Fiber Workspace — Usability Testing (/usability-testing)
 *
 * Structure only: header + description + Fiber empty-state. No functionality.
 *
 * FUTURE WORKFLOW: validates AI Prototype outputs (and their Flow Chart maps).
 * Not implemented yet.
 * ========================================================================= */

const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]";

const ILLUSTRATION = "/figmaAssets/empty-state/illustration-woman-magnifying-glass.svg";

export default function UsabilityTestingPage(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <h1
          className={`text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px] ${textPrimary}`}
        >
          Usability Testing
        </h1>
        <p className={`max-w-[640px] text-[length:var(--body-lg-regular-size,16px)] ${textMuted}`}>
          Validate the outputs of your AI Prototypes against real usability signals before they
          ship.
        </p>
      </div>

      {/* Empty state */}
      <div className="mt-[var(--spacing-500,40px)] flex min-h-[50vh] items-center justify-center">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-[var(--spacing-300,24px)] text-center">
          <img
            src={ILLUSTRATION}
            alt=""
            className="h-[200px] w-[200px] object-contain"
            aria-hidden
          />
          <div className="flex flex-col gap-[var(--spacing-100,8px)]">
            <p
              className={`text-[length:var(--headline-md-semibold-size,24px)] font-medium tracking-[-0.36px] ${textPrimary}`}
            >
              Usability testing is coming
            </p>
            <p
              className={`text-[length:var(--body-lg-regular-size,16px)] tracking-[-0.08px] ${textMuted}`}
            >
              Soon you'll be able to run studies and capture feedback that validates your AI
              Prototype outputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
