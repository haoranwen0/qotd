import React from "react"

import {
  Flex,
  Box,
  Heading,
  Button,
  ButtonProps,
  Text,
  Center
} from "@chakra-ui/react"
import { RiArrowRightLine } from "react-icons/ri"

import { QuestionInput, JournalInput } from ".."
import { useQOTD } from "./hook"

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
              {qotd.question}
            </Heading>
            <QuestionInput response={qotd.response} disabled={qotd.submitted} />
            {!qotd.submitted && (
              <Button {...buttonStyle} onClick={qotd.submit}>
                Continue
              </Button>
            )}
            <Flex
              flexDir="column"
              gap={6}
              data-state={qotd.submitted ? "open" : "closed"}
              _open={{
                animation: "slide-from-left 0.2s ease-in-out"
              }}
              _closed={{
                animation: "slide-to-left 0.2s ease-in-out"
              }}
              opacity={qotd.submitted ? 1 : 0}
              h={qotd.submitted ? "fit-content" : "0"}
              transition="opacity 0.2s ease-in-out"
            >
              <Button className="group" {...buttonStyle}>
                See what the world thinks...{" "}
                <Center
                  transition="transform 350ms ease-in-out"
                  _groupHover={{ transform: "translateX(4px)" }}
                >
                  <RiArrowRightLine />
                </Center>
              </Button>
              <Heading>Continue your thoughts</Heading>
              <Box pos="relative">
                <JournalInput thought={qotd.thought} />
                <Text
                  color="muted"
                  fontSize="sm"
                  pos="absolute"
                  top="100%"
                  left="0"
                  opacity={qotd.thought.value.isSaving ? 1 : 0}
                  data-state={qotd.thought.value.isSaving ? "open" : "closed"}
                  _open={{
                    animation: "slide-from-left 0.2s ease-in-out"
                  }}
                  _closed={{
                    animation: "slide-to-left 0.2s ease-in-out"
                  }}
                  transition="opacity 0.2s ease-in-out"
                >
                  Saved!
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

export default QOTD
