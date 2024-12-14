import React from "react"

import { Flex } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

import { Toaster } from "../../components/ui/toaster"
import { useAuthContext } from "../../contexts"
import {
  Calendar,
  BackgroundCurves,
  AuthenticationControl
} from "../../components"
import { AuthenticationDialogProvider } from "../../contexts/AuthenticationDialogContext"

const RootLayout: React.FC = () => {
  const { loading, user } = useAuthContext()

  if (loading) return <></>

  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
      {user !== null && <Calendar />}
      <BackgroundCurves />
      <Toaster />
      <AuthenticationDialogProvider>
        <Outlet />
        <AuthenticationControl />
      </AuthenticationDialogProvider>
    </Flex>
  )
}

export default RootLayout
