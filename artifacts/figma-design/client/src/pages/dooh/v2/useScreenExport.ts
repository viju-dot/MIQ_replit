import { useEffect, useState } from "react";
import type { ScreenData } from "../data";
import { EXCHANGE_RATES } from "./v2planner-sidebar";

export function useScreenExport(screens: ScreenData[], currency: "GBP" | "EUR" | "USD", resetKey?: string) {
  const [csvDownload, setCsvDownload] = useState<{ url: string; count: number } | null>(null);
  // V6 invalidates the last export when the plan or shortlist changes.
  // Other versions omit resetKey and retain their existing behavior.
  useEffect(() => {
    if (resetKey !== undefined) setCsvDownload(null);
  }, [resetKey]);
  useEffect(() => () => {
    if (csvDownload) URL.revokeObjectURL(csvDownload.url);
  }, [csvDownload]);

  const handleExport = () => {
    if (!screens.length) return;
    const rate = EXCHANGE_RATES[currency] || 1;
    const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";
    const escapeCsv = (value: string | number) => {
      const text = String(value);
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const headers = ["Screen ID", "Publisher", "City", "Venue", "Impressions", "Format", "Resolution", "Latitude", "Longitude", "Currency", `CPM (${symbol})`];
    const rows = screens.map(screen => [
      screen.id, screen.publisher, screen.city, screen.venue, screen.impressions,
      screen.creativeFormat, screen.creativeRes, screen.lat, screen.lng, currency,
      (screen.cpm * rate).toFixed(2),
    ].map(escapeCsv).join(","));
    const blob = new Blob(["\ufeff", [headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    setCsvDownload({ url, count: screens.length });
    const link = document.createElement("a");
    link.href = url;
    link.download = "DOOH-Shortlist.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return { csvDownload, handleExport };
}