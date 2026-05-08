# zarr.dev

Main Zarr website hosted at https://zarr.dev

## Local development

This site is built with [VitePress](https://vitepress.dev/). Requires Node.js 20+.

```bash
npm ci
npm run docs:dev      # dev server at http://localhost:5173/
npm run docs:build    # production build into .vitepress/dist/
npm run docs:preview  # preview the production build
```

## Deployment

The site deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`. The custom domain `zarr.dev` is preserved by `public/CNAME`, which VitePress copies into the build output.

## Redirects

Site-wide redirects (e.g. `/numcodecs/blosc` → `numcodecs.readthedocs.io`) are defined as a single YAML map at `.vitepress/redirects.yml`. The build hook in `.vitepress/plugins/redirects.ts` generates one static `<from>/index.html` meta-refresh stub per entry into the build output.

To add a redirect: append an entry to `.vitepress/redirects.yml` (`/path: target-url`) and rebuild.
