import { MetadataProvider } from './context/MetadataContext'

/** Auth is provided at app root (App.jsx) so marketing + booking share session */
export function ClientAppProviders({ children }) {
  return <MetadataProvider>{children}</MetadataProvider>
}
