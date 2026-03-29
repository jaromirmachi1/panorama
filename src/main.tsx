import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import App from './App.tsx'

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
