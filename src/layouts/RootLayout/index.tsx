import React from "react"

import { Outlet } from "react-router-dom"

import { Toaster } from "../../components/ui/toaster"
import { useAuthContext } from "../../contexts"

const RootLayout: React.FC = () => {
  const { loading } = useAuthContext()

  if (loading) return <></>

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}

export default RootLayout
