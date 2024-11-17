import React from "react"

import { Flex } from "@chakra-ui/react"

import {
  Calendar,
  BackgroundCurves,
  QOTD,
  AuthenticationControl
} from "../../components"

const Main: React.FC = () => {
  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
      <Calendar />
      <BackgroundCurves />
      <QOTD />
      <AuthenticationControl />
    </Flex>
  )
}

export default Main
