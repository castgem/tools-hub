# Trust Package

## Domain Strategy

- Single production domain for the whole site
- Category directories under the same root:
  - `/dev-tools/`
  - `/media-tools/`
  - `/creator-tools/`
  - `/document-tools/`

## Shared Trust Layer

- One `/about/`
- One `/contact/`
- One `/privacy/`

## Current Launch Assumptions

- Browser-first processing
- No mandatory signup
- No backend storage in the current launch
- Placeholder support inbox still needs maintainer input
- Placeholder production domain still needs deployer input

## Launch Follow-Up

- Replace `https://tools.example.com` in `astro.config.mjs`
- Replace placeholder support email on `/contact/`
- Validate sitemap, canonical URLs, and headers on the real deployment
