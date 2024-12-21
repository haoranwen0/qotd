import React, { useRef } from "react"

import { Toggle } from "../ui/toggle"
import {
  Flex,
  Box,
  Heading,
  Button,
  ButtonProps,
  Center,
  VStack,
  HStack,
  Text
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

  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <Flex maxW="md" flexDir="column">
      {!qotd.loading && (
        <Box w="full" color="text" h="full">
          <Heading fontSize="heading.md" textAlign={["left", "left", "center"]}>{qotd.currentDate}</Heading>
          <Flex
            gap={qotd.submitted ? 12 : 32}
            flexDir="column"
            justifyContent="center"
            h="full"
            pb="lg"
            position="relative"
            zIndex={1}
          >
            <Flex flexDir="column" alignItems="flex-start">
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
              <VStack alignItems="flex-start" gap={32}>
                {!qotd.submitted && (
                  <VStack>
                    <HStack gap={2} alignItems="center">
                      <Toggle
                        pressed={qotd.isPublic}
                        onPressedChange={qotd.updateIsPublic}
                        size="2xs"
                        aria-label="Toggle answer visibility"
                        variant="subtle"
                        style={{
                          backgroundColor: qotd.isPublic
                            ? "var(--chakra-colors-accent)"
                            : "var(--chakra-colors-bg-hover)",
                          border: qotd.isPublic
                            ? "1px solid var(--chakra-colors-accent)"
                            : "1px solid var(--chakra-colors-muted)"
                        }}
                      />
                      <Text fontSize="sm" color="muted">
                        (
                        {qotd.isPublic
                          ? "Share anonymously with the world"
                          : "Keep it private"}
                        )
                      </Text>
                    </HStack>
                    <Button
                      {...buttonStyle}
                      ref={buttonRef}
                      onClick={() => {
                        buttonRef.current?.blur()
                        qotd.submit()
                      }}
                    >
                      Submit
                    </Button>
                  </VStack>
                )}
              </VStack>
            </Flex>
            <Thought qotdSubmitted={qotd.submitted} qotd={qotd.value} />
            <Button
              className="group"
              variant="subtle"
              fontSize="body.secondary"
              bgColor="bg-hover"
              borderColor="bg-hover"
              onClick={() => qotd.navigate("/feed")}
            >
              See what the world thinks...
              <Center
                transition="transform 350ms ease-in-out"
                _groupHover={{ transform: "translateX(4px)" }}
              >
                <RiArrowRightLine />
              </Center>
            </Button>
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

export default QOTD
