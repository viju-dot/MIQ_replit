# DOOH Planner V2 — Phase 1 MVP

Open `/geo-planner?version=v2` or `/dooh-planner?version=v2`. The shared header includes Geo Planner, DOOH, Saved Audiences, and an original V1 selector.

## Working flow

1. Set Geo Planner filters and submit to compute a **deterministic mock** audience. Changing a filter requires resubmission before saving.
2. Save a 5–50 character name (letters, numbers, hyphens), with an optional description of up to 200 characters. Saved geography, description, and the submitted filter snapshot persist through the existing audience API.
3. An exact duplicate offers **Save a new version**. The server creates a unique suffixed name; it does not overwrite the original or remove its unique-name constraint. Similar names show an advisory.
4. Preview, edit, archive, or use the audience from Saved Audiences. Original audiences open the original editor; V2 audiences open the V2 editor.
5. In DOOH, combine the seven optional filter groups. Active groups intersect (AND); checked venue/publisher values match any selected value within their group. With no location configured, the mock inventory remains visible.
6. Use Map / Screen List to inspect matches and select screens. Selections outside the current matches are removed. Totals and CSV export use selected matches when present, otherwise all matches.

## Deliberate prototype boundaries

- Inventory is the existing 1,500-screen UK mock dataset. The existing shared saved-audience library supplies sample audiences.
- Geo intelligence and coverage are simulated, not audience research or live forecasts. EU/US examples can be saved but do not imply UK inventory matches.
- GBP is the inventory's reference currency. EUR/USD conversions use explicitly illustrative fixed rates (£1 = €1.17 = $1.25), not a live exchange-rate feed.
- Spend assumes purchasing each included screen's full modelled impression inventory. It is not a booked campaign or an allocation optimizer.
- An active total budget keeps affordable screens in deterministic ID order. This is a simple mock-budget constraint, not an optimized screen recommendation.
- Location radius accepts 50–10,000 metres, or equivalent kilometres. Custom daypart ranges must start before they end; overnight ranges are not supported.
- Map tiles require access to OpenStreetMap. Location uploads use the existing local parsers and mock postcode/POI support, not a worldwide geocoding service.
- **Activate** remains disabled and labelled “Activation not connected.” No DSP integration or campaign booking occurs.
- This work does not change prototype authentication or turn the existing shared library into a multi-tenant production account system.

## Checks

```sh
pnpm --filter @workspace/figma-design run check
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/figma-design run build
```

The API dev workflow builds once at startup; restart it after server or generated-schema changes.