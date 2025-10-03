import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Puerto fijo para el servidor de desarrollo
    strictPort: true, // Si el puerto está en uso, lanza error (no cambia solo)
  },
});
