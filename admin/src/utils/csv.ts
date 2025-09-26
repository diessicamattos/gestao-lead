// src/utils/csv.ts
import Papa from "papaparse";

export function exportToCsv(filename: string, rows: any[]) {
  const csv = Papa.unparse(rows, { header: true, newline: "\r\n" });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
