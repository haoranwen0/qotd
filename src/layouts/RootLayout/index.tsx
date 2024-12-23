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
import FeedbackForm from "../../components/FeedbackForm"

const RootLayout: React.FC = () => {
  const { loading, user } = useAuthContext()

  if (loading) return <></>

  return (
    <Flex minH="100dvh" bg="background" p="lg" justifyContent="center">
      {user !== null && <Calendar />}
      <BackgroundCurves />
      <Toaster />
      <AuthenticationDialogProvider>
        <Outlet />
        <AuthenticationControl />
      </AuthenticationDialogProvider>
      <FeedbackForm />
    </Flex>
  )
}

export default RootLayout
