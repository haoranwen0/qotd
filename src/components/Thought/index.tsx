import React from "react"

import { Flex, Heading, Box, Text } from "@chakra-ui/react"

import JournalInput from "../JournalInput"
import { ThoughtProps } from "./types"
import useThought from "./hook"

const Thought: React.FC<ThoughtProps> = ({ qotdSubmitted, qotd }) => {
  const { thought, cachedThought } = useThought({ qotd })

  return (
    <Flex
      flexDir="column"
      gap={6}
      data-state={qotdSubmitted ? "open" : "closed"}
      _open={{
        animation: "slide-from-left 0.2s ease-in-out"
      }}
      _closed={{
        animation: "slide-to-left 0.2s ease-in-out"
      }}
      opacity={qotdSubmitted ? 1 : 0}
      display={qotdSubmitted ? "flex" : "none"}
      transition="opacity 0.2s ease-in-out"
    >
      <Heading color="accent" fontSize="heading.md">
        Continue your thoughts
      </Heading>
      <Box pos="relative">
        <JournalInput thought={thought} cachedThought={cachedThought} />
        <Text
          color="muted"
          fontSize="sm"
          pos="absolute"
          top="100%"
          left="0"
          opacity={thought.value.isSaving ? 1 : 0}
          data-state={thought.value.isSaving ? "open" : "closed"}
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
  )
}

export default Thought
