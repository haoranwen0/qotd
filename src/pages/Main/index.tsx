import React from "react"

import { Box, Heading, Button, Flex } from "@chakra-ui/react"

import {
  ColorModeButton,
  useColorModeValue
} from "../../components/ui/color-mode"
import { QuestionInput } from "../../components"
import { useMain } from "./hook"

const Main: React.FC = () => {
  const { response, submit } = useMain()

  const curveColor = useColorModeValue("#D8D0CA", "#456354")

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <Flex minH="100vh" bg="background" p={8} justifyContent="center">
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
          <path
            d="M0 45C20 25 35 55 50 35C65 15 80 45 100 25"
            stroke={curveColor}
            strokeWidth="0.5"
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
      <Box position="fixed" top={4} right={4}>
        <ColorModeButton />
      </Box>
      <Flex maxW="md" flexDir="column">
        <Box w="full" color="text" h="full">
          <Heading fontSize="heading.md">{currentDate}</Heading>
          <Flex
            gap={6}
            flexDir="column"
            justifyContent="center"
            h="full"
            pb="lg"
            position="relative"
            zIndex={1}
          >
            <Heading
              color="accent"
              fontSize="heading.xl"
              lineHeight="1.2"
              fontWeight="medium"
            >
              What are you grateful for today?
            </Heading>
            <QuestionInput response={response} />
            <Button
              variant="plain"
              fontFamily="body"
              color="text"
              onClick={submit}
              px={0}
              alignSelf="flex-start"
              // textDecoration="underline"
              // textDecorationColor="accent"
              // textUnderlineOffset={4}
              // textDecorationThickness={2}
              textDecorationColor="transparent"
              backgroundImage="linear-gradient(transparent 80%, var(--chakra-colors-accent) 80%)"
              backgroundSize="80% 1.1em"
              backgroundPosition="0 100%"
              backgroundRepeat="no-repeat"
              fontSize="lg"
            >
              Save
            </Button>
            {/* <Response /> */}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Main
