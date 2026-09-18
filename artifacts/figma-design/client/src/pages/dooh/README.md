# DOOH — interactive prototype

This is a separate **DOOH / V1** prototype in the Fiber platform's AI Prototype
library. The TV Audience planner and its version history remain unchanged.

## Run

From the workspace root:

```sh
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/figma-design run dev
```

The existing managed workflows run these services. Open `/ai-prototype` and
choose DOOH, or open `/dooh-planner` directly. The shared API uses `/api`.
Development audience schema is maintained in `lib/db/src/schema/savedAudiences.ts`.
Publishing applies the development/production schema diff through the platform;
there is no startup-time production migration.

## Walkthrough

1. Open `/geo-planner`, configure the demo audience, and choose **Save Audience**.
   Names accept 5–50 letters, numbers, hyphens, or underscores. Invalid and
   duplicate names produce actionable errors; successful saves are stored in
   PostgreSQL, not only in the browser.
2. Open `/saved-audiences` to search, preview geography and metadata, edit,
   reuse, or archive an audience. Archiving is a soft delete.
3. Open `/dooh-planner`, choose an audience, and set the location radius.
   Initial state is empty with only Location enabled.
4. Enable the eight facets as needed: Location, Planning Zone, Venue Type,
   Publishers, Budget, Creative Type, Daypart, and Screen List.
5. Use map clusters and screen tooltips to explore matches. Circle/polygon
   planning zones constrain results. Table search, sorting, checkboxes, and
   linked map highlighting help build a shortlist.
6. Export selected matched screens, or all matched screens when none are
   selected, as `DOOH-Shortlist-YYYY-MM-DD.xlsx`.

## Demo data and assumptions

- Screen inventory is deterministic synthetic data across 12 UK cities. It is
  not live publisher availability, pricing, measurement, or a DSP connection.
- Twelve starting audiences are seeded in shared storage. User-created
  audiences, edits, archive state, and use counts also persist there.
- Postcode lookup is limited to the explicitly supported demo postcode set.
  Unsupported values must be reported rather than assigned fabricated locations.
- Coordinate CSVs accept real latitude/longitude values, but only synthetic
  screen inventory can match them.
- Spend assumes buying each matched screen's full modelled impression inventory:
  `sum(impressions * CPM / 1000)`. Overview CPM is impression-weighted.
  Budget filtering produces an illustrative affordable subset, not an optimizer
  or a guaranteed campaign forecast.
- GBP is the supported prototype currency; no currency-conversion service exists.
- Venue and publisher are scalar fields per screen. “ALL” with two different
  values therefore has no matching screen; “ANY” means their union.
- Daypart and availability are demo scheduling attributes, not live supply.
- Screen List starts **off**, following the brief's repeated MVP initial-state
  requirement rather than the single contradictory “Default: ON” example.

## Boundaries

- No authentication is requested. Actions use a clearly labelled demo identity;
  “Exit demo” returns to the prototype library, not a fabricated logout.
- Activation is disabled and marked as future DSP integration.
- OSM map tiles require network access and retain their attribution.
- Map screens and audience geometry remain distinct: selecting an audience
  applies its geography to synthetic screen discovery.
- Existing platform version/comment/annotation controls are retained.
- Production deployment visibility remains unchanged; publishing requires
  the project owner's action.

## Checks

```sh
pnpm --filter @workspace/figma-design exec tsc --noEmit
pnpm --filter @workspace/figma-design run build
```

The source requirements are
`attached_assets/DOOH_PLANNER_REPLIT_REQUIREMENTS_1789726006252.md`.
Demo routes above are the walkthrough links; no prerecorded demo is bundled.
Future work includes live inventory, production identity/account permissions,
approved forecasting rules, and DSP activation.