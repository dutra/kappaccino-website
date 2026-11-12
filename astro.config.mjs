import { defineConfig } from 'astro/config';

// On GitHub Pages the deploy workflow fills these in from the repository's
// Pages settings, so the site works at dutra.github.io/<repo>/ or on a custom
// domain without editing this file. Locally they fall back to the root.
const site = process.env.SITE_ORIGIN || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
});
