# DOOM STEPMOTHER (Vite + React + Electron)

## Install

```bash
npm install
```

## Run as Electron app (recommended)

```bash
npm run electron:dev
```

This starts Vite and then launches Electron once the dev server is available.

## Run web-only dev mode

```bash
npm run dev
```

## Run Electron from production build

```bash
npm run electron:build
```

This builds the frontend into `dist/` and then opens that build in Electron.

## Existing web deployment flow

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` folder to any static host if you still want a browser-hosted version.
