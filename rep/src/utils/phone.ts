// rep/src/utils/phone.ts
export function sanitizePhone(p: string) {
  return (p || "").replace(/\D/g, "");
}
