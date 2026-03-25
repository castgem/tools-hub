# Project Bundle

## Goal

Merge the strongest `dev-tools` and `media-tools` grouped launches into one deployable Astro project so the site can live on a single domain without duplicating trust pages, deployment config, or analytics setup.

## Included Sections

- `dev-tools/`
  - JSON Convertor
  - Text Formatter
  - Modern DevBox
- `media-tools/`
  - Image Optimizer
  - WebP to PNG
  - Video to GIF
  - Logo Generator
- `creator-tools/`
  - Social Profiler
  - XHunter
  - Writetune
  - Prompt Refiner
- `document-tools/`
  - PDF Easier

## Why These Belong Together

- They are all browser-first, no-backend utility workflows.
- They can share one About / Contact / Privacy layer.
- They benefit from the same technical stack: Astro static pages plus light islands for interactive tools.
- They need shared deployment defaults for one Netlify site.

## Why They Are Still Separated

- `dev-tools` and `media-tools` are different search-intent families.
- `creator-tools` and `document-tools` also need their own category pages.
- The category split prevents one homepage from becoming a generic keyword soup page.
- Each child page still owns one dominant cluster and one clear job-to-be-done.
