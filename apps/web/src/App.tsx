import './App.css'
import { helloCards } from '@aob/cards'
import { helloKernel } from '@aob/core'

function App() {
  return (
    <main className="app-shell">
      <section className="app-panel">
        <p className="app-badge">all-in-one-board</p>
        <h1 className="app-title">monorepo bootstrap ready</h1>
        <p className="app-description">
          pnpm + Turborepo + React on Vite with shared core &amp; cards packages.
        </p>

        <div className="app-status-grid">
          <article>
            <h2>Kernel</h2>
            <p>{helloKernel()}</p>
          </article>
          <article>
            <h2>Cards</h2>
            <p>{helloCards()}</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
