import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

import App from "./App.tsx"
import { Provider } from "./components/ui/provider.tsx"
import firebaseConfig from "./firebaseConfig.ts"
import "./index.css"

const app = initializeApp(firebaseConfig)
getAnalytics(app)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
)
