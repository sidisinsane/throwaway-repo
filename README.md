# Frontend Snippets

A Collection of Frontend Snippets using Astro‘s Content Collections API.

## Getting Started

1. Clone this repo
2. Install the dependencies: `pnpm install`
3. Copy and modify `.env.example` to `.env`
4. Start a local dev server: `pnpm run start`

### Managing Environment Variables on Github

1. Visit [Actions secrets and variables](https://github.com/sidisinsane/sidisinsane.github.io/settings/variables/actions) and add a `New repository variable` for each variable
2. Modify `.github/workflows/deploy.yml` accordingly

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      SITE_LOCALE: "$SITE_LOCALE"
      SITE_TITLE: "$SITE_TITLE"
      SITE_AUTHOR: "$SITE_AUTHOR"
      CODEPEN_USER: "$CODEPEN_USER"
      CODEPEN_NAME: "$CODEPEN_NAME"
```

### Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| ------------------------- | ------------------------------------------------ |
| `pnpm install`            | Installs dependencies                            |
| `pnpm run start`          | Alias for `pnpm run dev`                         |
| `pnpm run dev`            | Starts local dev server at `localhost:4321`      |
| `pnpm run build`          | Build your production site to `./dist/`          |
| `pnpm run preview`        | Preview your build locally, before deploying     |
| `pnpm run sync`           | Generate astro content collection types          |
| `pnpm run docs`           | Build your documentation to `./docs/`            |
| `pnpm run lint`           | Analyzes problems in your code                   |
| `pnpm run lint:fix`       | Fixes auto-fixable problems in your code         |
| `pnpm run prettier`       | Analyzes the formatting of your code             |
| `pnpm run prettier:write` | Formats your code                                |
| `pnpm run prepare:maps`   | See `bin/prepare-maps.js`                        |
| `pnpm run prepare:photos` | See `bin/prepare-photos.js`                      |
| `pnpm run astro ...`      | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro --help`   | Get help using the Astro CLI                     |
| ...                       | ...                                              |

## Social Media Image Size Guide

|  | **Instagram** | **Facebook** | **LinkedIn** | **Twitter** |
| --- | --- | --- | --- | --- |
| **Profile Photo** | 320x320 | 196x196 | 400x400 | 400x400 |
| **Cover Photo** |  | 851x315 | 1128x1191 | 1500x500 |
| **Landscape** | 1080x566 | 1200x630 | 1200x627 | 1600x900 |
| **Portrait** | 1080x1350 | 1080x1350 | 1080x1350 | 1080x1350 |
| **Square** | 1080x1080 | 1080x1080 | 1080x1080 | 1080x1080 |

“[Social Media Image Size Guide For All Platforms In 2023](https://www.searchenginejournal.com/social-media-image-sizes/488891/)”. Search Engine Journal. Retrieved September 18, 2023, 06:56

## Recommended Grid Behavior for Device Breakpoints¹

| **Screen size**         | **Margin** | **Body** | **Layout columns** |
| ----------------------- | ---------- | -------- | ------------------ |
| **Extra-small (phone)** |            |          |                    |
| 0-599dp²                | 16dp       | Fluid    | 4                  |
| **Small (tablet)**      |            |          |                    |
| 600-904                 | 32dp       | Fluid    | 8                  |
| 905-1239                | Fluid      | 840dp    | 12                 |
| **Medium (laptop)**     |            |          |                    |
| 1240-1439               | 200dp      | Fluid    | 12                 |
| **Large (desktop)**     |            |          |                    |
| 1440+                   | Fluid      | 1040     | 12                 |

1. “[Understanding Layout - Layout anatomy](https://m2.material.io/design/layout/understanding-layout.html#layout-anatomy)”. Material Design. Accessed September 19, 2023, 09:22
2. A dp is equal to one physical pixel on a screen with a density of 160. To calculate dp: `dp = (width in pixels * 160) / screen density`. When designing for the web, replace dp with px (for pixel). Source: [Pixel density - Material Design](https://m2.material.io/design/layout/pixel-density.html#pixel-density).
