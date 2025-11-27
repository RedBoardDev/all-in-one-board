# all-in-one-board

> A one-page, bento-style personal dashboard where every card is code. Fetch any data you want, render it however you like, and see everything in a single view.

---

## ✨ What is this?

**all-in-one-board** is a framework for building your own **personal, one-page dashboard**.

Instead of clicking through 10 websites each morning (crypto PnL, token prices, weather, promos, news…), you open **one page** and see **everything**:

- crypto prices, farm bots PnL, APY…
- metrics/analytics from any API
- weather, news, promos, whatever
- anything you can fetch or compute in code

You write **cards** in TypeScript/React.
Each card defines:

1. **How to fetch data** – completely free-form (`getData(): T | Promise<T>`)
2. **How to render it** – custom UI (`render(props)`)

The **kernel** takes care of:

- theme (light/dark + coherent colors)
- bento-style responsive layout
- loading / error states
- per-card refresh + global “Refresh All”
- optional default skeleton & error UIs

---

## 🧠 Core ideas

- **One-page dashboard**
  Everything is shown on a single responsive page (desktop + mobile).

- **Cards are just code**
  No rigid prebuilt widgets. Each card defines its own data type, data fetch and UI.

- **Kernel-driven orchestration**
  A core layer manages card registration, state, refresh, theme and layout.

- **Bento layout**
  Cards of different sizes tile nicely into a grid (big graphs, tiny KPIs, etc.).

- **Zero constraints on data**
  REST APIs
