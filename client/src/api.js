// In dev, Vite proxies /api to the local Express server.
// On static hosting (e.g. GitHub Pages) there is no backend, so calls will fail —
// pages catch that and show a "demo mode" explanation instead of a raw error.
const API_BASE = "/api";

export async function apiFetch(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const DEMO_MODE_MESSAGE =
  "Couldn't reach the backend. This feature needs the Express server running (see README) — it won't work on static hosting like GitHub Pages.";
