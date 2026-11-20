import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api-kutsut ohjataan paikalliseen Azure Functions -sovellukseen (func start)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:7071",
    },
  },
});
