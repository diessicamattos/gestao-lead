// src/utils/phone.ts
export function cleanPhone(p: string) {
  return (p || "").replace(/\D/g, "");
}
