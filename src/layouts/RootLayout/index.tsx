import React from "react"

import { Outlet } from "react-router-dom"

import { Toaster } from "../../components/ui/toaster"

const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}

export default RootLayout
