import React from "react"

import { Flex, Box, Heading, Button } from "@chakra-ui/react"

import { QuestionInput, JournalInput } from ".."
import { useQOTD } from "./hook"

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
            <QuestionInput response={qotd.response} />
            <Button
              variant="plain"
              color="text"
              onClick={qotd.submit}
              px={0}
              alignSelf="flex-start"
              textDecorationColor="transparent"
              backgroundImage="linear-gradient(transparent 80%, var(--chakra-colors-accent) 80%)"
              backgroundSize="80% 1.1em"
              backgroundPosition="0 100%"
              backgroundRepeat="no-repeat"
              fontSize="lg"
            >
              Save
            </Button>
            <Heading
              color="accent"
              fontSize="heading.xl"
              lineHeight="1.2"
              fontWeight="medium"
            >
              Continue your thoughts
            </Heading>
            <JournalInput />
            <Button
              variant="plain"
              color="text"
              px={0}
              alignSelf="flex-start"
              textDecorationColor="transparent"
              backgroundImage="linear-gradient(transparent 80%, var(--chakra-colors-accent) 80%)"
              backgroundSize="80% 1.1em"
              backgroundPosition="0 100%"
              backgroundRepeat="no-repeat"
              fontSize="lg"
            >
              See what the world thinks...
            </Button>
            <Button
              variant="plain"
              color="text"
              px={0}
              alignSelf="flex-start"
              textDecorationColor="transparent"
              backgroundImage="linear-gradient(transparent 80%, var(--chakra-colors-accent) 80%)"
              backgroundSize="80% 1.1em"
              backgroundPosition="0 100%"
              backgroundRepeat="no-repeat"
              fontSize="lg"
            >
              Save
            </Button>
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

export default QOTD
