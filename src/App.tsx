import React from "react"

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"

import { Main, NotFound } from "./pages"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Main />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App: React.FC = () => {
  return <RouterProvider router={router} />
}

export default App
