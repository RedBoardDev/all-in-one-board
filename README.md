<div style="display: flex; align-items: center; font-size: 2.7em; font-weight: bold;">
  <img src="apps/web/public/aob_icon.png" alt="all-in-one-board logo" height="48" style="vertical-align: middle; margin-right: 12px;" />
  <span style="font-size: 1em;">all-in-one-board</span>
</div>

<br />

## ✨ What is this?

**all-in-one-board** is a TypeScript/React framework for building your own **personal, unified dashboard**.
Instead of browsing 10 different sites for your daily info (crypto, tokens, weather, analytics, news…), just open **one page**—yours—and see it all, live.

Cards handle anything you like:

- crypto prices, DeFi PnL, APY, portfolio health…
- real-time analytics from any API
- weather, news headlines, shopping promos – you decide
- anything you can fetch or compute with code

Cards are **just code** – you write them in TypeScript/React. Every card consists of:

1. **Data fetching logic:**
   Free-form function: `getData(): T | Promise<T>`
2. **Rendering:**
   Custom React UI: `render(props)`

The **core (kernel)** provides:

- automatic theme (light/dark), coherent card colors
- responsive bento-style layout (desktops & mobiles)
- loading indicators & error states
- “refresh all data” & per-card refresh
- optional: default skeleton/error UI for fast prototyping

<br />

## 🧠 Core Principles

- **One-page experience:**
  Everything tiled in a single, fast, responsive view.
- **Cards = code:**
  No rigid widgets. You control data and UI per card. No boundaries.
- **Kernel-driven orchestration:**
  The framework manages card registration, state, refresh, layout, and theming.
- **Flexible bento layout:**
  Supports KPI tiles, big charts, mixed grid – all snap together.
- **No data constraints:**
  Fetch from REST, websockets, files, or compute directly. Anything goes.
- **TypeScript-first:**
  Your card types and logic are fully typesafe, strongly typed front-to-back.

<br />

## 🚀 Get started

1. **Install:**
   ```sh
   pnpm install
   ```
2. **Start the dashboard app:**
   ```sh
   pnpm --filter @aob/web dev
   ```
3. **Edit or add cards:**
   Work in `packages/cards/src/`. Cards export their data-fetch + render code.

<br />

## 📦 Tech used

- React 19, Vite 7, TypeScript 5, node v25.x
- Turborepo monorepo
- Everything modular—bring your own styles, data sources, preferences.

