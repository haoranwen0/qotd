import React from "react"

import { Flex } from "@chakra-ui/react"

import {
  Calendar,
  BackgroundCurves,
  QOTD,
  AuthenticationDialog
} from "../../components"

const Main: React.FC = () => {
  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
      <Calendar />
      <BackgroundCurves />
      <QOTD />
      <AuthenticationDialog />
    </Flex>
  )
}

export default Main
