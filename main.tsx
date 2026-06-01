import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppProvider } from './contexts/AppContext'
import { AISystemProvider } from './contexts/AISystemContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AIWorkspaceProvider } from './contexts/AIWorkspaceContext'
import { TRPCProvider } from './providers/trpc'
import { registerServiceWorker } from './utils/pushNotifications'
import App from './App'
import './index.css'

// Register service worker for push notifications
registerServiceWorker().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <ThemeProvider>
          <AppProvider>
            <AISystemProvider>
              <AIWorkspaceProvider>
                <SettingsProvider>
                  <App />
                </SettingsProvider>
              </AIWorkspaceProvider>
            </AISystemProvider>
          </AppProvider>
        </ThemeProvider>
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)
