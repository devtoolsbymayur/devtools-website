/** Strip control characters and limit length for user-provided text. */
export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  if (value.length > 200) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
