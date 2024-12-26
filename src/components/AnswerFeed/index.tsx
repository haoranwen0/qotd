import React, { useState, useEffect, useRef, useCallback } from "react"

import { Link } from "react-router-dom"

import {
  Flex,
  Box,
  Heading,
  Button,
  ButtonProps,
  Text,
  Center,
  HStack
} from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri"
import { useAnswerFeed } from "./hook"

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-25px); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
`

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

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
`

const AnswerFeed: React.FC = () => {
  const { answerIds, answers, currentAnswerIndex, showNextAnswer, hasDoneInitialFetch, loading, hasMore } = useAnswerFeed()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [nextAnswer, setNextAnswer] = useState("")

  const currentAnswer = answers[currentAnswerIndex]

  const answerBoxRef = useRef<HTMLDivElement>(null)
  const getButtonHeight = useCallback(() => Math.max((answerBoxRef.current?.clientHeight || 0) + 8, 96), [answerBoxRef])

  useEffect(() => {
    if (currentAnswer) {
      if (!displayedAnswer) {
        setDisplayedAnswer(currentAnswer)
      } else {
        setIsTransitioning(true)
        setNextAnswer(currentAnswer)

        const timer = setTimeout(() => {
          setDisplayedAnswer(currentAnswer)
          setIsTransitioning(false)
        }, 500)

        return () => clearTimeout(timer)
      }
    }
  }, [currentAnswer])

  if (!hasDoneInitialFetch) {
    return (
      <Flex maxW="md" flexDir="column" justifyContent="center" alignItems="center" minH="400px">
        <Text
          color="text"
          fontSize="lg"
          textAlign="center"
          opacity={0.8}
        >
          Finding thoughtful answers
          <HStack gap={1} display="inline-flex" ml={2}>
            <Box
              as="span"
              h="6px"
              w="6px"
              borderRadius="full"
              bg="accent"
              animation={`${bounce} 1.4s ease-in-out infinite`}
            />
            <Box
              as="span"
              h="6px"
              w="6px"
              borderRadius="full"
              bg="accent"
              animation={`${bounce} 1.4s ease-in-out infinite`}
              animationDelay="0.2s"
            />
            <Box
              as="span"
              h="6px"
              w="6px"
              borderRadius="full"
              bg="accent"
              animation={`${bounce} 1.4s ease-in-out infinite`}
              animationDelay="0.4s"
            />
          </HStack>
        </Text>
      </Flex>
    )
  }

  if (answers.length === 0 || !currentAnswer) {
    // Display "Nobody has answered" message
    return (
      <Flex
        maxW="md"
        flexDir="column"
        minH="400px"
        minW={["full", "md"]}
      >
        <Box w="full" color="text" h="full" display="flex" flexDir="column"> {/* Added display and flexDir */}
          {/* Fixed-height header */}
          <Flex
            mb={6}
            flexDir={["column", "row"]}
            justifyContent="space-between"
            alignItems={["flex-start", "center"]}
            gap={4}
          >
            <Heading fontSize="heading.md">
              No answers yet
            </Heading>
            <Button variant="plain" color="muted" className="group" ml={[-5, "inherit"]}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Center
                  transition="transform 350ms ease-in-out"
                  _groupHover={{ transform: "translateX(-4px)" }}
                >
                  <RiArrowLeftLine />
                </Center>
                Back to journal
              </Link>
            </Button>
          </Flex>

          {/* Center the "Nobody has answered" message */}
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Text
              fontSize="lg"
              color="muted"
              textAlign="center"
            >
              Nobody has answered this question yet. Be the first!
            </Text>
          </Flex>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex maxW="md" flexDir="column" minH="400px" minW={["full", "md"]}>
      <Box w="full" color="text" h="full">
        {/* Fixed-height header */}
        <Flex
          mb={6}
          flexDir={["column", "row"]}
          justifyContent="space-between"
          alignItems={["flex-start", "center"]}
          gap={4}
        >
          <Heading fontSize="heading.md">
            Answer {currentAnswerIndex + 1} of {answerIds.length}
          </Heading>
          <Button variant="plain" color="muted" className="group" ml={[-5, "inherit"]}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Center
                transition="transform 350ms ease-in-out"
                _groupHover={{ transform: "translateX(-4px)" }}
              >
                <RiArrowLeftLine />
              </Center>
              Back to journal
            </Link>
          </Button>
        </Flex>

        {/* Content area */}
        <Flex
          gap={6}
          flexDir="column"
          justifyContent="center"
          position="relative"
          zIndex={1}
          mt={32}
        >
          {/* Answer content */}
          <Box
            position="relative"
            data-state={loading ? "loading" : "idle"}
            opacity={loading ? 0.7 : 1}
            transition="opacity 0.2s ease-in-out"
            w="full"
            ref={answerBoxRef}
          >
            {/* Current answer */}
            <Box
              position={isTransitioning ? "absolute" : "relative"}
              inset="0"
              animation={isTransitioning ? `${fadeOut} 0.5s ease-out forwards` : undefined}
            >
              <Text fontSize="3xl">{displayedAnswer}</Text>
            </Box>

            {/* Next answer */}
            {isTransitioning && (
              <Box
                position="absolute"
                inset="0"
                animation={`${fadeIn} 0.5s ease-out forwards`}
              >
                <Text fontSize="3xl">{nextAnswer}</Text>
              </Box>
            )}
          </Box>

          {/* Footer area */}
          <Box position="absolute" top={`${getButtonHeight()}`} w="full">
            {(currentAnswerIndex < answers.length - 1 || hasMore) && (
              <Center>
                <Button
                  className="group"
                  {...buttonStyle}
                  onClick={showNextAnswer}
                  disabled={loading && currentAnswerIndex === answers.length - 1 || isTransitioning}
                >
                  Next answer{" "}
                  <Center
                    transition="transform 350ms ease-in-out"
                    _groupHover={{ transform: "translateX(4px)" }}
                  >
                    <RiArrowRightLine />
                  </Center>
                </Button>
              </Center>
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
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default AnswerFeed