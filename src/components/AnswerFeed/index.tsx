import React, { useCallback } from "react"

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
import { useAnswerFeed } from "./hook"


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

const AnswerFeed: React.FC = () => {
  const { answers, currentAnswer, currentAnswerIndex, loading, hasMore } = useAnswerFeed()

  if (answers.length === 0 || !currentAnswer) {
    return (
      <Flex maxW="md" flexDir="column" justifyContent="center" alignItems="center">
        <Text color="text">Loading...</Text>
      </Flex>
    )
  }

  return (
    <Flex maxW="md" flexDir="column">
      <Box w="full" color="text" h="full">
        <Heading fontSize="heading.md">
          Answer {currentAnswerIndex + 1} of {allIds.length}
        </Heading>
        <Flex
          gap={6}
          flexDir="column"
          justifyContent="center"
          h="full"
          pb="lg"
          position="relative"
          zIndex={1}
        >
          <Box
            data-state={loading ? "loading" : "idle"}
            position="relative"
            transition="opacity 0.2s ease-in-out"
            opacity={loading ? 0.7 : 1}
          >
            <Heading
              color="accent"
              fontSize="heading.xl"
              lineHeight="1.2"
              fontWeight="medium"
            >
              {currentAnswer.author}
            </Heading>
            <Text mt={4}>{currentAnswer.content}</Text>
            <Text color="muted" fontSize="sm" mt={2}>
              {currentAnswer.timestamp}
            </Text>
          </Box>

          {(currentAnswerIndex < answers.length - 1 || hasMore) && (
            <Button
              className="group"
              {...buttonStyle}
              onClick={showNextAnswer}
              disabled={loading && currentAnswerIndex === answers.length - 1}
            >
              Next answer{" "}
              <Center
                transition="transform 350ms ease-in-out"
                _groupHover={{ transform: "translateX(4px)" }}
              >
                <RiArrowRightLine />
              </Center>
            </Button>
          )}

          {currentAnswerIndex === answers.length - 1 && !hasMore && (
            <Text
              color="muted"
              fontSize="sm"
              textAlign="center"
              data-state="open"
              _open={{
                animation: "slide-from-left 0.2s ease-in-out"
              }}
            >
              You've reached the end!
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default AnswerFeed