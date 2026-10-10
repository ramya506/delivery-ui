export const API = import.meta.env.VITE_API_URL || "https://delivery-api-vna5.onrender.com";

/** GET {API}{path}?params  -> parsed JSON. Empty params are skipped. */
export async function api(path, params = {}) {
  const url = new URL(path, API);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
