# kostecki-dev-landing

Landing page for [kostecki.dev](https://kostecki.dev) — Vue 3, TypeScript, Vite.

Infrastructure and deploy: [kostecki-dev-infra](https://github.com/sebastian-kostecki/kostecki-dev-infra) (`docs/LANDING.md`). The build produces one HTML file per route plus `404.html`, so `docker/nginx.conf` must be deployed to the server together with `dist/`.

## Archive counter

`pnpm dev` and `pnpm build` first run `pnpm generate:archive`, which writes the gitignored `src/generated/archive.json`; on a fresh clone run it once before a standalone `pnpm type-check`. Without network it keeps the existing result or the tracked `src/generated/archive.fallback.json` and warns loudly.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
