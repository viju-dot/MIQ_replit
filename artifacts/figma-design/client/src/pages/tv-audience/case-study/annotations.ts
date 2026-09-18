import type { Hotspot } from "./types";

const mark = (id: string, type: Hotspot["type"], title: string, content: string, left: number, top: number, width: number, height: number): Hotspot => ({
  id, type, title, content, x: left + 2, y: top + 1.5,
  region: { left, top, width, height },
});

const shared = [
  mark("baseline-context", "WHY", "Start with an audience", "Available V1/V2 renderer: global filters establish market and audience context before the charts. This capture is not a frozen historical screenshot.", 6, 11, 74, 6),
  mark("baseline-distribution", "DECISION", "Separate distribution from destination", "The available baseline renderer uses a stacked media-type distribution and a separate channel/app chart. Distribution and viewing time answer different questions.", 6, 36, 88, 18),
  mark("baseline-next", "RESULT", "Content enters the journey", "Genre analytics follows channel/app analytics. Later dedicated Content Planner renderers make these relationships more explicit. This is an implementation comparison, not a measured usability result.", 6, 82, 88, 18),
];

const annotations: Record<string, Hotspot[]> = {
  "V5-show-detail": [
    mark("show-context", "WHY", "Preserve the overview; reveal a title", "Persisted annotation #37 asked to retain Top Indexing Shows and add a show-specific trend. Selecting a show opens this actual detail state; selecting All shows returns to the overview.", 2, 29, 96, 12),
    mark("show-lines", "DECISION", "Two measures, two readable scales", "The four-week chart plots households watching and average minutes watched per household on independent axes. Unlike Index, these two measures describe volume and consumption in the detail state.", 5, 48, 90, 45),
    mark("show-tooltip", "RESULT", "A shared period tooltip", "The original captured hover shows Week 3, household count and average minutes per household together. The values are synthetic prototype data, not audience research findings.", 46, 41, 33, 17),
  ],
  V1: shared,
  V2: shared,
  V3: [
    mark("v3-scope", "WHY", "Audience context first", "V3 combines market-aware audience controls with an Understand → Discover journey. Comparison is visibly marked as a future feature.", 6, 11, 78, 7),
    mark("v3-type", "DECISION", "A connected type selection", "The four-type stacked bar includes Homescreen in this available renderer. Type selections scope downstream content; Homescreen was removed in V5 because its data was not prepared.", 6, 29, 88, 18),
    mark("v3-index", "RESULT", "Index outside the plotted scales", "The channel/app chart already presents Index beneath categories while minutes and viewing share use the two scales. Do not attribute the introduction of every supporting Index label to V5.", 6, 52, 88, 25),
  ],
  V4: [
    mark("v4-index", "ISSUE", "Three measures in Trends", "V4 Trends plots average minutes, household percentage and an Index line. The case-study brief identifies metric/axis competition as a design problem. This is not the topic of stored annotation #20.", 7, 65, 85, 22),
    mark("v4-home", "WHY", "Homescreen had no prepared data", "V4 still displays a fourth Homescreen segment. Persisted V5 annotation #33 requested its removal because the data was not prepared—not because four segments were proven overwhelming.", 7, 37, 18, 20),
    mark("v4-group", "DECISION", "Group related questions", "V4 places media-type distribution and channel/app time spent in a shared card. This groups related planning questions while retaining separate chart forms.", 6, 31, 88, 28),
    mark("v4-summary", "RESULT", "An overview before exploration", "Six summary tiles precede the media, content and temporal sections. This is a visible information-architecture change from V3, not evidence of task-speed improvement.", 6, 15, 88, 12),
  ],
  V5: [
    mark("v5-type", "DECISION", "Three TV types, not four", "V5 retains Linear TV, Streaming and FAST. Annotation #33 cites unavailable Homescreen data. Platform distribution is still a donut; a separate stacked-bar card is an intended direction, not implemented V5.", 7, 36, 18, 23),
    mark("v5-bars", "RESULT", "Two plotted series; supporting Index", "V5 Trends removes the Index line. Minutes and the secondary percentage have separate axes, while Index sits below each category and in detail. This is the observed design result, not a measured comprehension gain.", 7, 69, 85, 20),
    mark("v5-label", "ISSUE", "Index notation remains unresolved", "The unedited capture still appends a percent sign to Index. Correct interpretation: Index 150 is 50% above national average. The case study records this discrepancy instead of claiming it is fixed.", 30, 57, 62, 2),
    mark("v5-apply", "WHY", "Stage an audience change", "Six global controls are applied together using Apply. This distinguishes pending audience selections from immediate local chart controls. The All / Addressable channels toggle remains immediate.", 6, 8, 88, 6),
  ],
  "V5-detail": [
    mark("v5-time", "RESULT", "When audiences watch", "The actual V5 heatmap combines seven days and six dayparts. Cells show average minutes and household percentage; hovering or focusing reveals detail, not a drilldown.", 6, 2, 88, 36),
    mark("v5-affinity", "DECISION", "Affinity has its own state", "Observed V5: eight-parameter radar, Index 100 benchmark and an internal top-five show list. It is not the brief's selected-genre-centred star. Genre selection does not update this card.", 6, 39, 27, 50),
    mark("v5-migration", "WHY", "A behavioural journey, not popularity", "The Sankey answers what happens within one hour after a selected show. The three behaviour branches are switching channel, moving to a streaming app and stopping viewing.", 33, 39, 61, 50),
    mark("v5-synthetic", "ISSUE", "Demonstration data is not research", "The prototype's own notes identify deterministic synthetic data. These captures demonstrate interactions and layout; they cannot substantiate market findings or business outcomes.", 6, 90, 88, 8),
  ],
};

export function getVersionHotspots(version: string): Hotspot[] {
  return annotations[version] ?? [];
}