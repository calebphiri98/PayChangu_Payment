// All backend URLs come from .env (VITE_API_BASE_URL) — nothing hardcoded here.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not set — copy .env.example to .env and set it."
  );
}
