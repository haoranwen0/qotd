import React from "react"

import { Flex } from "@chakra-ui/react"

import {
  Calendar,
  BackgroundCurves,
  ThemeToggle,
  QOTD,
  Response
} from "../../components"

const Main: React.FC = () => {
  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
      <Calendar />
      <ThemeToggle />
      <BackgroundCurves />
      <QOTD />
      {/* <Response /> */}
    </Flex>
  )
}

export default Main
