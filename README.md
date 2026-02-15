# DOOM STEPMOTHER (Vite + React)

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

> Do **not** open `index.html` directly with `file://...`.
> This app depends on Vite module processing for JSX and package imports.

## Production build

```bash
npm run build
```

This generates static assets in `dist/`.

## Preview production build

```bash
npm run preview
```

## Deploy

Deploy the generated `dist/` folder to any static host (Netlify, Vercel static output, S3+CloudFront, GitHub Pages, etc).
