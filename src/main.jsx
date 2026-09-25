import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SmoothScrollProvider from './providers/SmoothScrollProvider.jsx'
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
)
