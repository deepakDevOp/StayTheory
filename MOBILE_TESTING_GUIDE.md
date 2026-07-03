# Mobile Testing via Tunneling - Guide & Learnings

This guide documents the setup and troubleshooting steps required to expose the local Vite + React frontend and FastAPI backend to a mobile device using public tunneling (like Localtunnel, Cloudflare, or Serveo).

## 1. Vite Development Server Setup

By default, Vite blocks external access for security reasons. To allow a mobile device or a public tunnel to access the frontend, update `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    host: true, // Listens on all network interfaces (0.0.0.0)
    allowedHosts: true, // Prevents "Invalid Host header" errors when accessed via tunnel URLs
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      }
    }
  }
});
```

## 2. Starting the Tunnel

While testing, we used **Localtunnel** to generate a public URL. To prevent the URL from changing every time the tunnel restarts, it's best to use a fixed subdomain:

```bash
npx localtunnel --port 3000 --subdomain staytheorytest99
```
*Resulting URL: `https://staytheorytest99.loca.lt`*

## 3. The "White Screen" Bug (Localtunnel Splash Screen)

### The Problem
When using the free version of Localtunnel, it intercepts the very first request and returns an HTML "Friendly Reminder" splash screen. 
Because our React app makes background API calls (e.g., fetching properties) immediately on load, Localtunnel intercepted the API call and returned the HTML splash screen instead of the expected JSON data.
When the React code tried to run `.slice()` or `.map()` on the HTML response, it crashed instantly, resulting in a **blank white screen on mobile**.

### The Solution
1. **Frontend Array Safety**: We updated `PropertyCollection.tsx` to ensure it doesn't crash if it receives HTML instead of JSON.
   ```typescript
   const validData = Array.isArray(data) ? data : [];
   ```
2. **Header Bypass**: We added a secret header to `api.ts` to tell Localtunnel to never intercept our API calls:
   ```typescript
   headers: {
     "Content-Type": "application/json",
     "Bypass-Tunnel-Reminder": "true" // Instantly bypasses the splash screen
   }
   ```

## 4. Backend CORS Configuration

For the React frontend (running on the tunnel URL) to successfully fetch data from the FastAPI backend, the exact tunnel URL must be whitelisted in the backend.

1. Open `c:\StayTheoryBE\.env`
2. Add the tunnel URL to `ALLOWED_ORIGINS`:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://staytheorytest99.loca.lt
   ```
3. **Important**: You must completely stop (`Ctrl+C`) and restart `uvicorn` so it picks up the new `.env` values. `--reload` does not always refresh `.env` variables dynamically.

## 5. Alternative Tunnels (Serveo / Cloudflare) & 502 Bad Gateway Errors

If Localtunnel drops connections, you can use Serveo or Cloudflare (`untun`). However, we encountered `502 Bad Gateway` and `530 Origin Error`.

### The Cause
On Windows, tunneling tools often resolve `localhost` to the IPv6 address `::1`. However, Vite was only listening on the IPv4 address `127.0.0.1`. When the tunnel tried to route traffic to `localhost:3000`, the connection was refused.

### The Fix
Always bind alternative tunnels explicitly to `127.0.0.1` rather than `localhost`:

**Serveo Example:**
```bash
ssh -R 80:127.0.0.1:3000 serveo.net
```

**Cloudflare (untun) Example:**
```bash
npx untun@latest tunnel http://127.0.0.1:3000
```
