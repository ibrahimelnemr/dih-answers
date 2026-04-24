import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/health": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/admin": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/questions": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/tags": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/categories": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/answers": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
});
