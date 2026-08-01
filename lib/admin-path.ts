/** Obscured admin base path — do not link from public nav. */
export const ADMIN_BASE_PATH = "/admin-secure-portal-x051908";

export function adminPath(suffix = ""): string {
  if (!suffix || suffix === "/") return ADMIN_BASE_PATH;
  return `${ADMIN_BASE_PATH}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}
