import React from "react"

import { Box } from "@chakra-ui/react"

import { useColorModeValue } from "../ui/color-mode"

const BackgroundCurves: React.FC = () => {
  const curveColor = useColorModeValue("#D8D0CA", "#456354")

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      top="75%"
      transform="translateY(-50%)"
      height="100%"
      zIndex={0}
      pointerEvents="none"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <path
          d="M0 35C20 15 35 45 50 25C65 5 80 35 100 15"
          stroke={curveColor}
          strokeWidth="0.55"
          fill="none"
          opacity={0.8}
        /> */}
        <path
          d="M0 45C20 25 35 55 50 35C65 15 80 45 100 25"
          stroke={curveColor}
          strokeWidth="0.45"
          fill="none"
          opacity={0.6}
        />
        <path
          d="M0 55C20 35 35 65 50 45C65 25 80 55 100 35"
          stroke={curveColor}
          strokeWidth="0.35"
          fill="none"
          opacity={0.4}
        />
        <path
          d="M0 65C20 45 35 75 50 55C65 35 80 65 100 45"
          stroke={curveColor}
          strokeWidth="0.25"
          fill="none"
          opacity={0.2}
        />
      </svg>
    </Box>
  )
}

export default BackgroundCurves
