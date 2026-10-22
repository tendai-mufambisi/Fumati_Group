import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  // Expose VITE_* variables from .env files to the app.
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), "VITE_"))) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Keep server-only code (D1, R2, auth) out of the browser bundle.
        importProtection: {
          behavior: "error",
          client: { files: ["**/*.server.ts"], specifiers: ["server-only"] },
        },
        // Use src/server.ts (media, sitemap and SSR error wrapper) as the server entry.
        server: { entry: "server" },
      }),
      // Builds a Cloudflare Worker into .output/ for `wrangler deploy`.
      ...(command === "build" ? [nitro({ preset: "cloudflare-module" })] : []),
      viteReact(),
    ],
  };
});
