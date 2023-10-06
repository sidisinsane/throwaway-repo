import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://sidisinsane.github.io",
  markdown: {
    drafts: true,
  },
  integrations: [
    mdx({
      drafts: true,
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "dracula" },
      gfm: false,
    }),
  ],
});
