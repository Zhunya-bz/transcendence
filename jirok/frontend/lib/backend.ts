const BACKEND_URL = "/api";

export function getBackendUrl(path: string) {
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}