# DOOH PLANNER - REPLIT PROTOTYPE REQUIREMENTS
## Version 1.0 - Interactive Prototype Specification

**Project**: MIQ Digital Out-of-Home Planning Tool  
**Status**: Sprint 1 - Replit Prototype Build  
**Target**: Fully functional prototype (not static mockups)  
**Timeline**: 2 weeks  

---

## 📋 PROJECT CONTEXT

### Problem Statement
Traders manually rebuild geography, venue, and screen logic in DSP for every DOOH campaign. They can't reuse audiences from GeoPlanner. Solution: A unified DOOH Planner tool.

### User Types
- **Traders** (Primary) - Build DOOH shortlists
- **Sellers** (Secondary) - Create client pitches
- **Account Managers** (Secondary) - Manage campaigns

### Success Metrics
✅ Traders can save audiences from GeoPlanner  
✅ Traders can select saved audience in DOOH Planner  
✅ Traders can apply 8 filters to find screens  
✅ Traders can see matching screens on interactive map  
✅ Traders can export screen list to Excel  

---

## 🏗️ ARCHITECTURE OVERVIEW

### Module 1: Save Audience (Foundation)
- Save button in GeoPlanner
- Name audience (modal)
- Backend table storage
- Dropdown selection in DOOH Planner

### Module 2: Full DOOH Planner (Main Build)
- Location input (4 methods)
- Campaign filters (8 facets)
- Interactive map visualization
- Screen list table
- Export functionality

### Supporting Feature
- Saved Audiences Management Screen
- View all saved audiences
- Preview audience details
- Edit/Delete audiences

---

## 📱 UI LAYOUT (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 DOOH PLANNER                                [Logout]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐│
│  │   SIDEBAR        │  │    MAP PANEL     │  │  EXPORT    ││
│  │  (Filters)       │  │  (Screen Pins)   │  │  (Button)  ││
│  │                  │  │                  │  │            ││
│  │ ✓ Location       │  │  [Interactive UK │  │ ┌────────┐ ││
│  │   • Saved Aud.   │  │   Map with pins] │  │ │ ↓Export││ ││
│  │   • Postcode     │  │                  │  │ └────────┘ ││
│  │   • POI Search   │  │                  │  │            ││
│  │   • Lat/Long     │  │                  │  │            ││
│  │                  │  │                  │  │            ││
│  │ ✓ Venue Type     │  │                  │  │            ││
│  │ ✓ Publishers     │  │                  │  │            ││
│  │ ✓ Budget         │  │                  │  │            ││
│  │ ✓ Creative Type  │  │                  │  │            ││
│  │ ✓ Daypart        │  │                  │  │            ││
│  │ ✓ Planning Zone  │  │                  │  │            ││
│  │ ✓ Screen List    │  │                  │  │            ││
│  └──────────────────┘  └──────────────────┘  └────────────┘│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  📊 SCREEN LIST TABLE (Bottom Panel)                        │
│  ┌────────────────────────────────────────────────────────┐│
│  │ ID | Publisher | City | Venue | CPM | Impressions   ││
│  │ ┌─────────────────────────────────────────────────┐  ││
│  │ │ S001 │ Clear Channel │ London │ Mall │ £15 │ 2.5M   ││
│  │ │ S002 │ JCDecaux      │ London │ Transit │ £12 │ 1.8M  ││
│  │ └─────────────────────────────────────────────────┘  ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 USER WORKFLOWS

### Workflow 1: Trader Saves Audience in GeoPlanner

```
STEP 1: GeoPlanner Home
├─ User builds audience (filters/geography)
└─ Clicks "💾 Save Audience" button

STEP 2: Naming Modal
├─ Modal pops up: "Name this audience"
├─ User types: "Cinema-Goers-London-Budget"
└─ Clicks "Save"

STEP 3: Confirmation
├─ Shows: "✓ Saved to library"
├─ Backend stores: {ID, Name, CreatedBy, CreatedDate, GeoDefinition}
└─ Ready to use in DOOH Planner

STEP 4: Saved Audiences Screen (Optional)
├─ User navigates to "📋 Saved Audiences"
├─ Sees list: "Cinema-Goers-London-Budget" (Created by Alex on Sep 15)
├─ Can click "👁 Preview" to see details
├─ Can click "✏ Edit" to modify
├─ Can click "🗑 Delete" to archive
└─ Sees total count: "12 audiences saved"
```

### Workflow 2: Trader Uses Saved Audience in DOOH Planner

```
STEP 1: DOOH Planner Opens
├─ Shows: "✓ GeoPlanner → Find Screens" (Stepper)
└─ Location section expanded

STEP 2: Select Saved Audience
├─ Click "Location" tab → "Geo Planner"
├─ Dropdown shows: "Cinema-Goers-London-Budget"
├─ Select it
└─ Set radius: "500m"

STEP 3: Apply Additional Filters
├─ Turn ON "Venue Type" toggle
├─ Select: "Malls" + "Transit"
├─
├─ Turn ON "Publishers" toggle
├─ Select: "Clear Channel"
├─
├─ Turn ON "Budget" toggle
├─ Set: £50,000
└─ System filters in real-time

STEP 4: View Results
├─ Map updates: Shows matching screens as pins
├─ Screen List Table updates: Shows 45 matching screens
├─ Plan Overview shows:
│  ├─ Match Count: 45 screens
│  ├─ Est. CPM: £12.50
│  └─ Est. Impressions: 3.2M

STEP 5: Select & Export
├─ Trader selects top 10 screens from table
├─ Clicks "↓ Export"
├─ Downloads Excel with screen data
└─ Ready for activation/pitch
```

### Workflow 3: View & Manage Saved Audiences

```
STEP 1: Open Saved Audiences Screen
├─ Navigate to "📋 Saved Audiences"
├─ Shows: "Total Saved: 12 audiences"
└─ Shows: "Last Updated: Sep 15, 2026"

STEP 2: Browse & Search
├─ Search box: "Type to filter..."
├─ User types "cinema"
├─ Table shows only cinema-related audiences
└─ Click "Clear" to show all

STEP 3: View Audience Details
├─ Each audience row shows:
│  ├─ Name: "Cinema-Goers-London-Budget"
│  ├─ Geo Info: "📍 Points: 12 postcodes"
│  ├─ Coverage: "📊 2.3M population"
│  ├─ Created: "Sep 15 by Alex Chen"
│  └─ Usage: "3× (used 3 times)"
│
├─ Click "👁 Preview" → Modal shows:
│  ├─ Full postcode list
│  ├─ Interactive map of area
│  └─ All metadata
│
├─ Click "✏ Edit" → Goes to GeoPlanner with pre-loaded data
│
└─ Click "🗑 Delete" → Archive (soft delete)

STEP 4: Use from This Screen
├─ Click "Use This Audience" button
└─ Jumps to DOOH Planner with audience pre-selected
```

---

## 📊 MODULE 1: SAVE AUDIENCE - DETAILED SPECS

### GeoPlanner Screen (Simplified Mock)

**Location:** `/geo-planner`

**Components:**
```
┌─ GeoPlanner Header ─────────────────────────────┐
│ 🗺️ GEO PLANNER - Build Your Audience            │
└─────────────────────────────────────────────────┘

┌─ Audience Builder (Mock) ───────────────────────┐
│ Filters:                                         │
│ ☐ Price Range: Budget ↔️ Premium                │
│ ☐ Location: [Map showing UK outline]            │
│ ☐ Interest: Cinema, Retail, Travel              │
│                                                  │
│ Current Audience Definition:                    │
│ • 12 postcodes in London                        │
│ • Budget tier only                              │
│ • 2.3M population coverage                      │
│                                                  │
│ [💾 Save Audience Button] [Step 2 Save Button]  │
└─────────────────────────────────────────────────┘
```

**Save Button 1 (Step 1):**
- **Label**: "💾 Save Audience"
- **Position**: Below audience definition
- **Action**: Opens naming modal
- **State**: Active when audience is defined

**Save Button 2 (Step 2):**
- **Label**: "💾 Save (Final Version)"
- **Position**: At summary/results screen
- **Action**: Opens same naming modal
- **Note**: Optional - tests if Step 2 adoption differs from Step 1

### Naming Modal

**Trigger:** Click save button (either Step 1 or Step 2)

**Modal Structure:**
```
┌─ Save Audience Modal ──────────────────────────┐
│ 💾 Name This Audience                    [X]   │
├────────────────────────────────────────────────┤
│                                                 │
│ Audience Name:                                  │
│ ┌───────────────────────────────────────────┐  │
│ │ Cinema-Goers-London-Budget                │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ This name helps you recognize it later in     │
│ DOOH Planner dropdown.                        │
│                                                 │
│ ⚠️ Validation Rules:                           │
│ • Min 5 characters                             │
│ • Max 50 characters                            │
│ • No special characters (letters, numbers,    │
│   hyphens, underscores only)                  │
│ • If duplicate name exists: Warn user          │
│   "Similar audience exists: [Show options]"   │
│                                                 │
│                    [Cancel] [💾 Save]          │
└────────────────────────────────────────────────┘
```

**Input Field:**
- Text input, placeholder: "e.g., Cinema-Goers-London"
- Real-time character counter (shows: "5/50")
- Real-time validation feedback (red/green)

**Save Button Action:**
1. Validate input (length, characters)
2. Check for duplicates (warn if exists)
3. Show loading state: "Saving..."
4. On success: Close modal, show toast: "✓ Saved to library"
5. On error: Show error message, allow retry
6. Update Saved Audiences count

### Backend Table (Data Model)

**Table Name:** `saved_audiences`

**Columns:**
```
{
  id: "AUD_001",                           // Unique ID
  name: "Cinema-Goers-London-Budget",      // User-provided name
  createdBy: "alex.chen@miq.com",          // Creator email/name
  createdDate: "2026-09-15T10:30:00Z",     // ISO timestamp
  geoType: "points",                       // points | polygon | radius
  geoDefinition: {                         // The actual geo data
    points: [
      { postcode: "SE1 7AA", city: "London" },
      { postcode: "W1D 3QF", city: "London" },
      // ... 10 more
    ],
    radius: null,
    polygon: null,
    coverage: "2.3M population"
  },
  accountId: "ACC_123",                    // Linked account/opportunity
  linkedBrief: "Cinema-Brief-Q3",          // Optional: which brief uses it
  usageCount: 3,                           // How many times used
  isActive: true,                          // Soft delete flag
  updatedDate: "2026-09-15T10:30:00Z"      // Last modified
}
```

**Mock Data (For Prototype):**
```javascript
[
  {
    id: "AUD_001",
    name: "Cinema-Goers-London-Budget",
    createdBy: "Alex Chen",
    createdDate: "2026-09-15",
    geoType: "points",
    geoDefinition: {
      points: [
        { postcode: "SE1 7AA", city: "London" },
        { postcode: "W1D 3QF", city: "London" },
        { postcode: "SW1A 2AA", city: "London" },
        // ... 9 more
      ]
    },
    coverage: "2.3M",
    usageCount: 3
  },
  {
    id: "AUD_002",
    name: "Cinema-Goers-Manchester",
    createdBy: "Jamie Williams",
    createdDate: "2026-09-12",
    geoType: "points",
    geoDefinition: {
      points: [
        { postcode: "M1 1AA", city: "Manchester" },
        // ... 7 more
      ]
    },
    coverage: "1.2M",
    usageCount: 1
  },
  // ... more audiences
]
```

---

## 📊 MODULE 2: DOOH PLANNER - DETAILED SPECS

### Main Screen Layout

**Route:** `/dooh-planner`

**3-Panel Layout:**
1. **Left Sidebar** (30%): Filters & controls
2. **Center Map** (50%): Interactive visualization
3. **Right/Bottom Table** (20%): Screen list

### Panel 1: Sidebar (Filter Controls)

**Header:**
```
┌─ Stepper ────────────────────────────────────┐
│ ✓ GeoPlanner Saved → Find Screens → Activate│
│   (Shows workflow progress)                  │
└──────────────────────────────────────────────┘
```

**Filters (All Start OFF except Location):**

#### Filter 1: LOCATION (START ON)
```
┌─ 📍 LOCATION ─────────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ [Saved Audience] [Postcode] [POI] [Lat/Lng] │
│                                              │
│ ┌─ SAVED AUDIENCE TAB (Active) ─────────────┐│
│ │ Select Saved Audience:                    ││
│ │ ┌──────────────────────────────────────┐  ││
│ │ │ Cinema-Goers-London-Budget        ▼ │  ││
│ │ └──────────────────────────────────────┘  ││
│ │                                           ││
│ │ Radius (meters):                          ││
│ │ ┌──────────────────────────────────────┐  ││
│ │ │ 500                                  │  ││
│ │ └──────────────────────────────────────┘  ││
│ │                                           ││
│ │ [👁 Preview Audience]                     ││
│ │ [📋 View All Saved]                       ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌─ POSTCODE TAB (Inactive) ─────────────────┐│
│ │ Upload postcodes (.csv):                  ││
│ │ [📤 Drop file here]                       ││
│ │ Radius: [500]                             ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌─ POI TAB (Inactive) ──────────────────────┐│
│ │ Search POI:                               ││
│ │ ┌──────────────────────────────────────┐  ││
│ │ │ 🔍 Search malls, airports, etc.    │  ││
│ │ └──────────────────────────────────────┘  ││
│ │ Radius: [500]                             ││
│ │ Results: No results yet                   ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌─ LAT/LONG TAB (Inactive) ─────────────────┐│
│ │ Upload coordinates (.csv):                ││
│ │ [📤 Drop file here]                       ││
│ │ Radius: [500]                             ││
│ └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

#### Filter 2: PLANNING ZONE
```
┌─ 🗺️ PLANNING ZONE ────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ [🎨 Draw on Map]                             │
│ Shape Type: [Circle ▼] or [Polygon ▼]       │
│                                              │
│ Drawn Zones:                                 │
│ ┌──────────────────────────────────────────┐│
│ │ Zone 1: Circle (center: Oxford St)   [X]││
│ │ Zone 2: Polygon (5 vertices)          [X]││
│ └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

#### Filter 3: VENUE TYPE
```
┌─ 🏢 VENUE TYPE ───────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ Logic: [Match ANY ▼] (AND/OR toggle)        │
│                                              │
│ [📋 Select Venues]                           │
│ ┌──────────────────────────────────────────┐│
│ │ ☑️ Malls                                 ││
│ │ ☐ Roadside                              ││
│ │ ☑️ Transit                              ││
│ │ ☐ Airport                               ││
│ │ ☐ Conference                            ││
│ │ ☐ Gyms                                  ││
│ │ ☐ Bus Station                           ││
│ └──────────────────────────────────────────┘│
│ Selected: 2 venues                           │
└──────────────────────────────────────────────┘
```

#### Filter 4: PUBLISHERS
```
┌─ 📻 PUBLISHERS ───────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ Logic: [Match ANY ▼]                         │
│                                              │
│ [📋 Select Publishers]                       │
│ ┌──────────────────────────────────────────┐│
│ │ ☑️ Clear Channel                        ││
│ │ ☐ JCDecaux                              ││
│ │ ☐ SOCi                                  ││
│ │ ☐ Hivestack                             ││
│ │ ☐ Other                                 ││
│ └──────────────────────────────────────────┘│
│ Selected: 1 publisher                        │
└──────────────────────────────────────────────┘
```

#### Filter 5: BUDGET
```
┌─ 💷 BUDGET ───────────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ Currency: [GBP ▼]                            │
│                                              │
│ Total Budget:                                │
│ ┌──────────────────────────────────────────┐│
│ │ £ 50,000                                 │
│ └──────────────────────────────────────────┘│
│                                              │
│ CPM (Optional):                              │
│ ┌──────────────────────────────────────────┐│
│ │ £ 12.50                                  │
│ └──────────────────────────────────────────┘│
│                                              │
│ Budget Used: £48,500 / £50,000 (97%)        │
└──────────────────────────────────────────────┘
```

#### Filter 6: CREATIVE TYPE
```
┌─ 🎬 CREATIVE TYPE ────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ Format: [Display ▼]  or [Video ▼]           │
│                                              │
│ Resolution: [Preset ▼] or [Custom]          │
│ ┌──────────────────────────────────────────┐│
│ │ 1920 x 1080                              │
│ └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

#### Filter 7: DAYPART
```
┌─ ⏰ DAYPART ──────────────────────────────────┐
│ [Toggle ON/OFF]                              │
│                                              │
│ [Presets] [Custom Range]                     │
│                                              │
│ Presets:                                     │
│ [Early Morning] [Morning] [Midday]           │
│ [Afternoon] [Evening] [Late Night]           │
│                                              │
│ Applies: [Every Day ▼]                       │
└──────────────────────────────────────────────┘
```

#### Filter 8: SCREEN LIST
```
┌─ 📋 SCREEN LIST ──────────────────────────────┐
│ [Toggle ON/OFF] (Default: ON)                │
│                                              │
│ Upload Screen List (.csv/.xlsx):             │
│ [📤 Drop file here]                          │
│                                              │
│ Status: No file uploaded                     │
│                                              │
│ [📥 Download Template]                       │
└──────────────────────────────────────────────┘
```

### Panel 2: Interactive Map

**Location:** Center of screen, 50% width

**Features:**
```
┌─ Interactive Map ──────────────────────────────┐
│ [Map showing UK outline]                       │
│                                                │
│ [Zoom +] [-] [Reset View]                      │
│                                                │
│ Screen Pins:                                   │
│ • Red pins = All matched screens               │
│ • Count bubble = Overlapping pins (clickable)  │
│                                                │
│ On Hover:                                      │
│ • Show tooltip: "Screen ID: S001"              │
│               "Publisher: Clear Channel"       │
│               "CPM: £15"                       │
│                                                │
│ On Click:                                      │
│ • Highlight in screen list table               │
│                                                │
│ Status:                                        │
│ "45 screens matched"                           │
└────────────────────────────────────────────────┘
```

**Technical Notes:**
- Use Leaflet.js or Mapbox for map rendering
- UK base layer (OpenStreetMap)
- Real-time pin updates as filters change
- Mock 1000+ screen data for demo
- Clustering enabled for overlapping pins

### Panel 3: Plan Overview & Export

**Location:** Right side or floating card

```
┌─ Plan Overview ────────────────────────────────┐
│ 📊 SUMMARY                                      │
│                                                │
│ Matched Screens: 45                            │
│ Selected Screens: 10                           │
│                                                │
│ Est. CPM: £12.50                               │
│ Est. Impressions: 3.2M                         │
│ Est. Total Spend: £40,000                      │
│                                                │
│ Budget Utilization:                            │
│ [████████░] 80% of £50,000                     │
│                                                │
│ [↓ Export] [➜ Activate]                        │
└────────────────────────────────────────────────┘
```

### Panel 4: Screen List Table (Bottom)

**Columns:**
| Col | Data | Sortable | Filterable |
|-----|------|----------|-----------|
| **ID** | Screen ID | ✓ | ✓ |
| **Publisher** | Clear Channel, JCDecaux, etc. | ✓ | ✓ |
| **City** | London, Manchester, etc. | ✓ | ✓ |
| **Venue** | Mall, Transit, Airport | ✓ | ✓ |
| **CPM** | £15 | ✓ | ✓ |
| **Impressions** | 2.5M | ✓ | ✗ |

**Features:**
- Live search by any column
- Click row to highlight on map
- Checkbox to select/deselect screens
- Selection state persists in export
- Sticky header (scrolls with content)
- Shows total: "45 screens matched"

---

## 🎯 SUPPORTED WORKFLOWS (MVP)

### Workflow A: Save Audience (Module 1)
```
✓ GeoPlanner: Build audience
✓ GeoPlanner: Click "Save Audience" button
✓ Modal: Enter name "Cinema-Goers-London"
✓ Modal: Validation (checks duplicate)
✓ Backend: Stores in table
✓ Toast: Shows "✓ Saved"
✓ Saved Audiences: Shows in list
```

### Workflow B: Use Saved Audience (Module 2)
```
✓ DOOH Planner: Open
✓ Location: Select "Cinema-Goers-London" from dropdown
✓ Location: Set radius "500m"
✓ Map: Updates with matching screens
✓ Table: Shows 45 matching screens
```

### Workflow C: Apply Filters
```
✓ Turn ON "Venue Type" toggle
✓ Select "Malls" + "Transit"
✓ Map: Updates (fewer pins)
✓ Table: Updates (fewer rows)
✓ Plan Overview: Updates (CPM, impressions)
```

### Workflow D: View & Manage Saved Audiences
```
✓ Open "📋 Saved Audiences" screen
✓ See all 12 saved audiences
✓ Search by name
✓ Click "👁 Preview" → See details in modal
✓ Click "✏ Edit" → Go to GeoPlanner with pre-loaded data
✓ Click "🗑 Delete" → Archive (soft delete)
✓ See usage count (3× used)
```

### Workflow E: Export Screens
```
✓ Apply filters
✓ Select top 10 screens in table
✓ Click "↓ Export"
✓ Download Excel with columns: ID, Publisher, City, Venue, CPM, Impressions
```

---

## 🗂️ FILE STRUCTURE (Replit)

```
/replit-dooh-planner
├── /pages
│   ├── GeoPlanner.tsx          # Save Audience
│   ├── DOOHPlanner.tsx         # Main planner
│   ├── SavedAudiences.tsx      # Management screen
│   └── NotFound.tsx
│
├── /components
│   ├── Filters.tsx             # All filter controls
│   ├── Map.tsx                 # Interactive map
│   ├── ScreenTable.tsx         # Data table
│   ├── Modal.tsx               # Name modal, preview
│   ├── Stepper.tsx             # Workflow progress
│   ├── Toast.tsx               # Notifications
│   └── Header.tsx
│
├── /data
│   ├── mockAudiences.ts        # Sample saved audiences
│   ├── mockScreens.ts          # 1000+ mock screens
│   └── mockPOI.ts              # Points of interest
│
├── /hooks
│   ├── useFilters.ts           # Filter state management
│   ├── useAudiences.ts         # Audience CRUD
│   └── useScreens.ts           # Screen filtering
│
├── /utils
│   ├── api.ts                  # Mock backend calls
│   ├── excel.ts                # Export to Excel
│   ├── validation.ts           # Input validation
│   └── constants.ts            # App constants
│
├── /styles
│   ├── globals.css
│   ├── layout.css
│   └── components.css
│
├── App.tsx
├── index.tsx
├── package.json
└── README.md
```

---

## 🎨 TECH STACK (Replit)

**Frontend Framework:**
- React.js (with hooks)
- TypeScript
- Tailwind CSS (styling)

**Map Library:**
- Leaflet.js (lightweight, no API key needed)
- Or: Mapbox (if API available)

**Data Export:**
- SheetJS (xlsx library) for Excel generation

**UI Components:**
- shadcn/ui or HeadlessUI (or build custom)

**State Management:**
- React Context API (useContext/useReducer)

**Testing (Optional for MVP):**
- Placeholder for future unit tests

---

## 📊 MOCK DATA SPECIFICATIONS

### Mock Audiences (10-12)
```javascript
[
  {
    id: "AUD_001",
    name: "Cinema-Goers-London-Budget",
    createdBy: "Alex Chen",
    createdDate: "2026-09-15",
    geoType: "points",
    points: 12,
    coverage: "2.3M",
    usageCount: 3
  },
  // ... more
]
```

### Mock Screens (1000+)
```javascript
[
  {
    id: "S001",
    publisher: "Clear Channel",
    city: "London",
    venue: "Mall",
    lat: 51.5074,
    lng: -0.1278,
    cpm: 15,
    impressions: 2500000,
    creative: "video",
    resolution: "1920x1080"
  },
  // ... 999 more
]
```

### Mock POI
```javascript
[
  {
    id: "POI_001",
    name: "Harrods",
    type: "Mall",
    lat: 51.5024,
    lng: -0.1589,
    city: "London",
    screens: 5
  },
  // ... more
]
```

---

## ✅ ACCEPTANCE CRITERIA (MVP)

### Module 1: Save Audience
- [ ] GeoPlanner page loads with mock audience definition
- [ ] "Save Audience" button visible and clickable
- [ ] Naming modal pops up on click
- [ ] Input validation works (min 5 chars, no special chars)
- [ ] Duplicate name detection warns user
- [ ] Save button stores data in mock backend
- [ ] Toast shows "✓ Saved"
- [ ] Saved audiences appear in dropdown in DOOH Planner

### Module 2: DOOH Planner
- [ ] Loads with empty state (no filters active except Location)
- [ ] Saved Audience dropdown populated with mock data
- [ ] Selecting audience updates map with matching screens
- [ ] All 8 filter toggles functional
- [ ] Filters update map in real-time
- [ ] Screen table shows correct data based on filters
- [ ] Plan Overview updates with live CPM/impressions
- [ ] Export button downloads Excel file

### Saved Audiences Screen
- [ ] Page loads showing all saved audiences
- [ ] Total count displays (e.g., "12 audiences")
- [ ] Search/filter works by audience name
- [ ] "👁 Preview" opens modal with audience details + map
- [ ] "✏ Edit" button navigates to GeoPlanner (future phase)
- [ ] "🗑 Delete" archives audience (soft delete)
- [ ] "Use This Audience" button pre-selects in DOOH Planner

### Interactive Map
- [ ] UK map renders with Leaflet.js
- [ ] Screen pins display at correct lat/lng
- [ ] Pins cluster when overlapping
- [ ] Hover shows tooltip (ID, Publisher, CPM)
- [ ] Click pin highlights in table
- [ ] Zoom/pan controls work
- [ ] Real-time update as filters change

### Screen List Table
- [ ] Shows correct columns (ID, Publisher, City, Venue, CPM, Impressions)
- [ ] Sortable by clicking column headers
- [ ] Live search by any column
- [ ] Rows selectable with checkboxes
- [ ] Clicking row highlights pin on map
- [ ] Sticky header scrolls with content
- [ ] Shows total count ("45 screens matched")

### Export Functionality
- [ ] Export button generates Excel file
- [ ] Excel includes: ID, Publisher, City, Venue, CPM, Impressions
- [ ] Exports only selected screens (or all if none selected)
- [ ] File downloads correctly
- [ ] File named: "DOOH-Shortlist-{Date}.xlsx"

---

## 🚀 DEPLOYMENT

**Replit Deployment:**
- Deploy as public URL
- Share link for testing
- No authentication needed (mock login for demo)

**URL Format:**
```
https://your-replit-name.replit.dev/
```

---

## 📝 DOCUMENTATION

**README should include:**
1. How to run locally
2. Feature walkthrough
3. Mock data explanation
4. Known limitations
5. Future enhancements
6. Screen capture/demo links

---

## 🎯 SUCCESS CRITERIA (Overall)

✅ Prototype is fully interactive (not static mockups)  
✅ All core workflows work end-to-end  
✅ Real-time filter updates on map & table  
✅ Export produces valid Excel  
✅ Mobile responsive (basic)  
✅ Code is clean & commented  
✅ Deploys on Replit without errors  
✅ Can demo to stakeholders  

---

**Ready to build? Start with GeoPlanner page, then DOOH Planner, then polish.**

**Estimated time: 5-7 days of development work**

