import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname), "");
  const rawPort = process.env.PORT || env.PORT || "5173";
  const port = Number(rawPort);
  const basePath = process.env.BASE_PATH || env.BASE_PATH || "/";

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@sentry")) {
                return "vendor-sentry";
              }
              if (id.includes("lucide-react") || id.includes("react-icons")) {
                return "vendor-icons";
              }
              if (id.includes("framer-motion")) {
                return "vendor-animation";
              }
              if (id.includes("@tanstack")) {
                return "vendor-query";
              }
              if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) {
                return "vendor-ui";
              }
              if (id.includes("recharts") || id.includes("d3-")) {
                return "vendor-charts";
              }
              if (
                id.includes("/node_modules/react/") ||
                id.includes("\\node_modules\\react\\") ||
                id.includes("/node_modules/react-dom/") ||
                id.includes("\\node_modules\\react-dom\\") ||
                id.includes("/node_modules/scheduler/") ||
                id.includes("\\node_modules\\scheduler\\") ||
                id.includes("wouter")
              ) {
                return "vendor-react";
              }
            }
          },
        },
      },
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
