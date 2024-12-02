import React from "react"

import {
  Flex,
  Box,
  Heading,
  Button,
  ButtonProps,
  Center,
  VStack
} from "@chakra-ui/react"
import { RiArrowRightLine } from "react-icons/ri"

import { QuestionInput } from ".."
import { useQOTD } from "./hook"
import Thought from "../Thought"

const buttonStyle: ButtonProps = {
  variant: "plain",
  color: "text",
  px: 0,
  alignSelf: "flex-start",
  textDecorationColor: "transparent",
  backgroundImage:
    "linear-gradient(transparent 80%, var(--chakra-colors-accent) 80%)",
  backgroundSize: "80% 1.1em",
  backgroundPosition: "0 100%",
  backgroundRepeat: "no-repeat",
  fontSize: "lg"
}

const QOTD: React.FC = () => {
  const qotd = useQOTD()

  return (
    <Flex maxW="md" flexDir="column">
      {!qotd.loading && (
        <Box w="full" color="text" h="full">
          <Heading fontSize="heading.md">{qotd.currentDate}</Heading>
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
              {qotd.value.question}
            </Heading>
            <QuestionInput
              response={qotd.response}
              disabled={qotd.submitted}
              updateResponse={qotd.updateResponse}
            />
            <VStack alignItems="flex-start">
              {!qotd.submitted && (
                <Button {...buttonStyle} onClick={qotd.submit}>
                  Continue
                </Button>
              )}
              <Button
                className="group"
                variant="plain"
                fontSize="body.secondary"
                pl={0}
              >
                See what the world thinks...{" "}
                <Center
                  transition="transform 350ms ease-in-out"
                  _groupHover={{ transform: "translateX(4px)" }}
                >
                  <RiArrowRightLine />
                </Center>
              </Button>
            </VStack>
            <Thought qotdSubmitted={qotd.submitted} qotd={qotd.value} />
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

export default QOTD
