import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/opsz.css'
import '@/styles/reset.css'
import './home.css'
import { initAnalytics } from '@/lib/analytics'
import { App } from './App'

initAnalytics('home')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
