import React from "react"

import { Flex } from "@chakra-ui/react"

import { AuthenticationDialogProvider } from "../../contexts/AuthenticationDialogContext"

import {
  Calendar,
  BackgroundCurves,
  QOTD,
  AuthenticationControl
} from "../../components"

const ViewAnswer: React.FC = () => {
  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
      <Calendar />
      <BackgroundCurves />
      <AuthenticationDialogProvider>
        <QOTD />
        <AuthenticationControl />
      </AuthenticationDialogProvider>
    </Flex>
  )
}

export default ViewAnswer
