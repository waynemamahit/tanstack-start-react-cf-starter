import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    tsconfigPaths: true,
  },
  optimizeDeps: {
    exclude: ["@/*"],
  },
  plugins: [
    devtools(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
      remoteBindings: false, // Use local mode to avoid SSL certificate issues
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
