---
name: Dynamic Leaflet marker accessibility
description: Numeric marker icons and their accessible labels can update independently.
---

When a cluster count changes, update its accessible name as well as the visible icon HTML.

**Why:** React Leaflet can update a divIcon while retaining the marker's original title option. Focus handlers that assign an aria-label only when a marker is added can consequently announce an older parent count even while the visible subgroup number is correct.

**How to apply:** Either explicitly synchronize title and aria-label after icon updates, or recreate that cluster marker when its count changes. Do not assume updating the JSX title prop alone updates an existing Leaflet marker's accessible name.
