import { CREATIVE_FORMATS, RESOLUTIONS } from "../data";

export interface CreativeScreenCounts {
  formats: Record<string, number>;
  resolutions: Record<string, number>;
  overall: number;
}

/** Count each alternative with the other creative dimension kept in place. */
export function countCreativeOptions(
  selection: { format: string; resolution: string; resolutions?: string[] },
  countMatches: (format: string, resolution: string, resolutions?: string[]) => number,
): CreativeScreenCounts {
  return {
    formats: Object.fromEntries(["", ...CREATIVE_FORMATS].map(format =>
      [format, countMatches(format, selection.resolution, selection.resolutions)],
    )),
    resolutions: Object.fromEntries(["", ...RESOLUTIONS].map(resolution =>
      [resolution, countMatches(selection.format, resolution)],
    )),
    overall: countMatches(selection.format, selection.resolution, selection.resolutions),
  };
}
