import React from "react"

import { Box, Container, VStack, Heading, Button } from "@chakra-ui/react"

import { ColorModeButton } from "../../components/ui/color-mode"
import { QuestionInput, Response } from "../../components"
import { useMain } from "./hook"

const Main: React.FC = () => {
  const { response, submit } = useMain()

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <Box minH="100vh" bg="background" p={8}>
      <Box position="fixed" top={4} right={4}>
        <ColorModeButton />
      </Box>
      <Container maxW="md" centerContent>
        <Box w="full" color="text">
          <VStack gap={8} align="stretch">
            <Heading fontSize="heading.md">{currentDate}</Heading>
            <VStack gap={6} align="stretch">
              <Heading color="text" fontSize="heading.xl" lineHeight="1.2">
                What are you grateful for today?
              </Heading>
              <QuestionInput response={response} />
              <Button variant="subtle" fontFamily="body" onClick={submit}>
                Save
              </Button>
              <Response />
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default Main
