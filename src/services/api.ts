import axios from "axios";

// The backend URL is entirely env-driven — set VITE_API_URL once per
// environment (local .env for dev, the hosting platform's env vars for
// staging/production) and nothing else needs to change. Fail fast at
// startup if it's missing rather than silently sending requests nowhere.
const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_URL is not set. Define it in .env (local) or your hosting platform's environment variables (production) — e.g. http://localhost:8000/api/v1 or https://api.staytheory.com/api/v1."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_PUBLIC_API_KEY,
    "Bypass-Tunnel-Reminder": "true"
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("staytheory_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function flushQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

function logout() {
  localStorage.removeItem("staytheory_token");
  localStorage.removeItem("staytheory_refresh_token");
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = "/admin/login";
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("staytheory_refresh_token");
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { "X-API-Key": import.meta.env.VITE_PUBLIC_API_KEY } }
      );
      localStorage.setItem("staytheory_token", data.access_token);
      localStorage.setItem("staytheory_refresh_token", data.refresh_token);
      flushQueue(data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch {
      logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
