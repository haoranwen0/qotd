import React from "react"

import { Box } from "@chakra-ui/react"

import { ColorModeButton } from "../ui/color-mode"

const ThemeToggle: React.FC = () => {
  return (
    <Box position="fixed" top={4} right={4}>
      <ColorModeButton />
    </Box>
  )
}

export default ThemeToggle
