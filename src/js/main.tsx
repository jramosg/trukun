import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes'
import { store } from './store'
import { Provider } from 'react-redux'
import './i18n'
const container = document.getElementById('root')
const root = createRoot(container!)

// Render the app with Suspense, ensure translations are loaded
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
