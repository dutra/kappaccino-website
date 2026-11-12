# kappaccino website

Landing page for [kappaccino](https://github.com/dutra/kappaccino), built with [Astro](https://astro.build) and
deployed as a static site on GitHub Pages.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve the built site
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. In the repository settings, set
**Pages → Build and deployment → Source** to **GitHub Actions** once.

The workflow reads the site origin and base path from the repository's Pages settings and passes them to the build
(`SITE_ORIGIN`, `BASE_PATH`), so the same code works at `https://<user>.github.io/<repo>/` and on a custom domain.

## Where things are

- `src/pages/index.astro`: the whole page. Text content lives in the arrays at the top of the file.
- `src/components/LensToy.astro`: the interactive lens in the hero (inverse ray shooting on a canvas).
- `src/assets/abell-s1063-webb.jpg`: the backdrop in the cup, a crop of ESA/Webb image
  [potm2505a](https://esawebb.org/images/potm2505a/) (CC BY 4.0; credit ESA/Webb, NASA & CSA, H. Atek, M. Zamani).
- `src/layouts/Base.astro`: head tags, fonts and the starfield.
- `src/styles/global.css`: colours, type and shared styles.
