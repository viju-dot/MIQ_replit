import * as XLSX from "xlsx";
import { MOCK_POSTCODES, SCREENS, type ScreenData } from "./data";

export interface UploadReport {
  valid: number;
  unknown: string[];
  malformed: string[];
  duplicates: string[];
}

function rowsFromCsv(text: string): string[][] {
  return text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean).map(line => {
    const cells: string[] = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) {
        cells.push(value.trim());
        value = "";
      } else value += char;
    }
    cells.push(value.trim());
    return cells;
  });
}

export async function parsePostcodeCsv(file: File) {
  if (!file.name.toLowerCase().endsWith(".csv")) throw new Error("Unsupported file type. Upload a .csv file.");
  const rows = rowsFromCsv(await file.text());
  if (!rows.length) throw new Error("The CSV is empty.");
  const header = rows[0].map(v => v.toLowerCase().replace(/\s/g, ""));
  const column = header.findIndex(v => v === "postcode" || v === "postalcode");
  if (column < 0) throw new Error('Missing required "postcode" header.');
  const points: Array<{ lat: number; lng: number }> = [];
  const report: UploadReport = { valid: 0, unknown: [], malformed: [], duplicates: [] };
  const seen = new Set<string>();
  rows.slice(1).forEach((row, index) => {
    const postcode = (row[column] || "").toUpperCase().replace(/\s+/g, " ").trim();
    if (!postcode) return report.malformed.push(`Row ${index + 2}`);
    if (seen.has(postcode)) return report.duplicates.push(postcode);
    seen.add(postcode);
    const match = MOCK_POSTCODES[postcode];
    if (!match) return report.unknown.push(postcode);
    points.push({ lat: match.lat, lng: match.lng });
    report.valid++;
  });
  return { points, report };
}

export async function parseCoordinateCsv(file: File) {
  if (!file.name.toLowerCase().endsWith(".csv")) throw new Error("Unsupported file type. Upload a .csv file.");
  const rows = rowsFromCsv(await file.text());
  if (!rows.length) throw new Error("The CSV is empty.");
  const header = rows[0].map(v => v.toLowerCase().replace(/[\s_/.-]/g, ""));
  const latColumn = header.findIndex(v => v === "lat" || v === "latitude");
  const lngColumn = header.findIndex(v => v === "lng" || v === "lon" || v === "long" || v === "longitude");
  if (latColumn < 0 || lngColumn < 0) throw new Error('Missing required "lat" and "lng" headers.');
  const points: Array<{ lat: number; lng: number }> = [];
  const malformed: string[] = [];
  const duplicates: string[] = [];
  const seen = new Set<string>();
  rows.slice(1).forEach((row, index) => {
    const lat = Number(row[latColumn]);
    const lng = Number(row[lngColumn]);
    if (!row[latColumn]?.trim() || !row[lngColumn]?.trim() || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      malformed.push(`Row ${index + 2}`);
      return;
    }
    const key = `${lat},${lng}`;
    if (seen.has(key)) return duplicates.push(key);
    seen.add(key);
    points.push({ lat, lng });
  });
  return { points, report: { valid: points.length, unknown: [], malformed, duplicates } as UploadReport };
}

export async function parseScreenList(file: File, screens: ScreenData[]) {
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension !== "csv" && extension !== "xlsx") throw new Error("Unsupported file type. Upload .csv or .xlsx.");
  let rows: string[][];
  if (extension === "csv") rows = rowsFromCsv(await file.text());
  else {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, raw: false }).map(r => r.map(String));
  }
  return parseScreenListRows(rows, screens);
}

export function parseScreenListCsvText(text: string, screens: ScreenData[]) {
  return parseScreenListRows(rowsFromCsv(text), screens);
}

function parseScreenListRows(rows: string[][], screens: ScreenData[]) {
  if (!rows.length) throw new Error("The file is empty.");
  const header = rows[0].map(v => String(v).toLocaleLowerCase().replace(/[\s_-]/g, ""));
  const idColumn = header.findIndex(v => v === "screenid" || v === "id");
  if (idColumn < 0) throw new Error('Missing required "screen_id" header.');
  const known = new Map(screens.map(screen => [screen.id.toLocaleLowerCase(), screen.id]));
  const ids: string[] = [];
  const report: UploadReport = { valid: 0, unknown: [], malformed: [], duplicates: [] };
  const seen = new Set<string>();
  rows.slice(1).forEach((row, index) => {
    const suppliedId = String(row[idColumn] ?? "").trim();
    if (!suppliedId) return report.malformed.push(`Row ${index + 2}`);
    const matchKey = suppliedId.toLocaleLowerCase();
    const canonicalId = known.get(matchKey);
    const displayId = canonicalId ?? suppliedId;
    if (seen.has(matchKey)) return report.duplicates.push(displayId);
    seen.add(matchKey);
    if (!canonicalId) return report.unknown.push(suppliedId);
    ids.push(canonicalId);
    report.valid++;
  });
  return { ids, report };
}

export function downloadScreenTemplate() {
  const sampleIds = SCREENS.slice(0, 3).map(screen => screen.id);
  const blob = new Blob([["Screen ID", ...sampleIds].join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dooh-screen-list-template.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}