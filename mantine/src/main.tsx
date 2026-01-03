import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n' // Initialize i18next

// PWA temporarily disabled
// import { registerSW } from 'virtual:pwa-register'
//
// const updateSW = registerSW({
//   onNeedRefresh() {
//     if (confirm('New version available. Reload?')) {
//       updateSW(true)
//     }
//   },
//   onOfflineReady() {
//     console.log('App is ready to work offline')
//   },
// })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)