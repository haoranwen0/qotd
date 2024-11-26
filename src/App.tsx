import React from "react"

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"

import { AuthProvider } from "./contexts"
import { RootLayout } from "./layouts"
import { Main, NotFound, ViewAnswer } from "./pages"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="" element={<Main />} />
      <Route path="day">
        <Route path=":day" element={<Main />} />
      </Route>
      <Route path="feed" element={<ViewAnswer />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
