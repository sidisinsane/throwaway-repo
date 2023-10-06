/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/playwright/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{playwright,karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    coverage: {
      enabled: true,
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage/unit/vitest",
    },
  },
});
