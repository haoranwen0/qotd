import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

import { Provider } from "./components/ui/provider.tsx"

import App from "./App.tsx"

import "./index.css"
import firebaseConfig from "./firebaseConfig.ts"

const app = initializeApp(firebaseConfig)
getAnalytics(app)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
)
