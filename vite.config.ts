import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ mode }) => {
  void mode;
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The frontend talks to the backend directly via its absolute
      // VITE_API_URL + the backend's CORS config (see src/services/api.ts)
      // rather than a dev-server proxy, so the same request path works
      // identically in dev and production — no /api rewrite needed here.
      host: true, // Listen on all network interfaces
      allowedHosts: true, // Allow all external hosts (Localtunnel/Mobile IP)
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
