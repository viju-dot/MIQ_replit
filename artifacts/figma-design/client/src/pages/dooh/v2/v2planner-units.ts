export function convertRadiusUnit(
  radius: number | "",
  from: "m" | "km",
  to: "m" | "km",
): number | "" {
  if (radius === "" || from === to) return radius;
  return Number((radius * (from === "km" ? 1000 : 1) / (to === "km" ? 1000 : 1)).toPrecision(15));
}