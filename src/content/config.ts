import { defineCollection, reference, z } from "astro:content";

const DEFAULT_DATE = currDatestring();
const DEFAULT_AUTHOR_ID = "sidisinsane";
const DEFAULT_LOCALE = "en-US";

const snippets = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    image: z.string().optional(),
    locale: z.string().default(DEFAULT_LOCALE),
    pubDate: z.string().default(DEFAULT_DATE),
    isBasedOnUrl: z.string().optional(),
    author: reference("authors").default(DEFAULT_AUTHOR_ID),
    relatedSnippets: z.array(reference("snippets")).optional(),
    stylesheet: z.union([z.string(), z.array(z.string())]).optional(),
    javascript: z.union([z.string(), z.array(z.string())]).optional(),
    isDraft: z.boolean().default(false),
    codepenSlug: z.string().optional(),
  }),
});

const udhr = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    image: z.string().optional(),
    locale: z.string().default(DEFAULT_LOCALE),
    pubDate: z.string().default(DEFAULT_DATE),
    url: z.string().optional(),
    name: z.string().optional(),
    headline: z.string().optional(),
    script: z.string().optional(),
    exonym: z.string().optional(),
    author: reference("authors").default(DEFAULT_AUTHOR_ID),
    isDraft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  schema: z.object({
    alias: z.string(),
    name: z.string().optional(),
    homepage: z.string().optional(),
    github: z.string().optional(),
    codepen: z.string().optional(),
    linkedin: z.string().optional(),
    xing: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    email: z.string().email().optional(),
    isDraft: z.boolean().default(false),
  }),
});

export const collections = {
  snippets,
  authors,
  udhr,
};

function currDatestring() {
  const date = new Date();
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  return `${year}-${month}-${day}`;
}
