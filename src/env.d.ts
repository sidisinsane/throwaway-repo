/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_AUTHOR: string;
  readonly SITE_LOCALE: string;
  readonly SITE_TITLE: string;
  readonly CODEPEN_USER: string;
  readonly CODEPEN_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
