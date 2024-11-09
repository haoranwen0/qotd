import React from "react"

import { Flex, Box, Heading, Button } from "@chakra-ui/react"

import { QuestionInput } from ".."
import { useQOTD } from "./hook"

const QOTD: React.FC = () => {
  const { response, submit, currentDate } = useQOTD()

  return (
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
    </Flex>
  )
}

export default QOTD
