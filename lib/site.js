export const SITE_URL = "https://www.homesalesfairfax.com";
export const SITE_NAME = "Home Sales Fairfax";

export function absoluteUrl(path) {
  if (!path || path === "/") return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : "/" + path);
}
