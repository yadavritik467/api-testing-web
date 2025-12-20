import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/api-testing-web/",
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  server: {
    host: true, // Allows access from your network
    port: 5174, // Default port
    open: false,
  },
});
