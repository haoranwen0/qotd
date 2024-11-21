import React from "react"

import { Box } from "@chakra-ui/react"

const BackgroundCurves: React.FC = () => {
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
          d="M0 45C20 25 35 55 50 35C65 15 80 45 101 10"
          stroke="#E8A4A4"
          strokeWidth="0.45"
          fill="none"
          opacity={0.2}
        />
        <path
          d="M0 55C20 35 35 65 50 45C65 25 80 55 100 35"
          stroke="#7FB5AA"
          strokeWidth="0.35"
          fill="none"
          opacity={0.2}
        />
        <path
          d="M0 65C20 45 35 75 50 55C65 35 80 65 100 45"
          stroke="#456354"
          strokeWidth="0.25"
          fill="none"
          opacity={0.15}
        />
        <path
          d="M0 75C20 55 35 85 50 65C65 45 80 75 100 55"
          stroke="#96B5AC"
          strokeWidth="0.25"
          fill="none"
          opacity={0.15}
        />
        <path
          d="M0 85C20 65 35 95 50 75C65 55 80 85 100 65"
          stroke="#567D6E"
          strokeWidth="0.25"
          fill="none"
          opacity={0.1}
        />
        {/* <path
          d="M0 45C20 25 35 55 50 35C65 15 80 45 100 25"
          stroke="#E8A4A4"
          strokeWidth="0.45"
          fill="none"
          opacity={0.6}
        />
        <path
          d="M0 55C20 35 35 65 50 45C65 25 80 55 100 35"
          stroke="#7FB5AA"
          strokeWidth="0.35"
          fill="none"
          opacity={0.4}
        />
        <path
          d="M0 65C20 45 35 75 50 55C65 35 80 65 100 45"
          stroke="#456354"
          strokeWidth="0.25"
          fill="none"
          opacity={0.2}
        />
        <path
          d="M0 75C20 55 35 85 50 65C65 45 80 75 100 55"
          stroke="#96B5AC"
          strokeWidth="0.25"
          fill="none"
          opacity={0.15}
        />
        <path
          d="M0 85C20 65 35 95 50 75C65 55 80 85 100 65"
          stroke="#567D6E"
          strokeWidth="0.25"
          fill="none"
          opacity={0.1}
        /> */}
        {/* <path
          d="M0 85 C15 80, 25 45, 40 55 S60 25, 75 35 S90 15, 105 5"
          stroke="#E8A4A4"
          strokeWidth="0.45"
          fill="none"
          opacity={0.6}
        />
        <path
          d="M0 65 C20 85, 30 35, 50 45 S75 15, 85 25 S95 10, 100 15"
          stroke="#7FB5AA"
          strokeWidth="0.35"
          fill="none"
          opacity={0.4}
        />
        <path
          d="M0 95 C25 75, 35 55, 45 35 S65 45, 80 20 S90 5, 100 10"
          stroke="#456354"
          strokeWidth="0.25"
          fill="none"
          opacity={0.2}
        /> */}
      </svg>
    </Box>
  )
}

export default BackgroundCurves
