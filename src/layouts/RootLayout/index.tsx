import React from "react"

import { Box, Flex } from "@chakra-ui/react"
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
    <Box h="100dvh" bg="background" overflow="auto" id="main-root-container">
      <Flex
        p={8}
        justifyContent="center"
        minH="full"
      >
        {user !== null && <Calendar />}
        <BackgroundCurves />
        <Toaster />
        <AuthenticationDialogProvider>
          <Outlet />
          <AuthenticationControl />
        </AuthenticationDialogProvider>
        <FeedbackForm />
      </Flex>
    </Box>
  )
}

export default RootLayout
