# Launch Scorecard

## Scope

This scorecard is for the merged single-domain site, not the older separate grouped hubs.

## Ready Now

- Single Astro project root
- Shared `netlify.toml`
- Shared trust pages
- Category directories for `dev-tools`, `media-tools`, `creator-tools`, and `document-tools`
- Child routes nested under the correct category paths
- Unified full audit completed on March 25, 2026
- `development_actionable = 0`
- `ready_for_build_signoff = true`

## Still Required Before Public Launch

- Set the real production domain in `astro.config.mjs`
- Replace the placeholder support email
- Validate live HTTPS, cache headers, compression, CSP, and sitemap coverage
- Confirm trailing-slash behavior and sitemap coverage on the live deployment
- Review manual-only audit items such as critical request chains and keyword-density heuristics
