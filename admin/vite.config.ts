// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // expõe no localhost e no IP (192.168.x.x)
    port: 5173,
    strictPort: true,
    hmr: {
      host: "localhost", // força a usar localhost
      protocol: "ws",
      clientPort: 5173,
    },
  },
});
