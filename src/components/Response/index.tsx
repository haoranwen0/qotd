import React from "react"

import { Card, HStack, Stack, Text } from "@chakra-ui/react"

import { Avatar } from "../ui/avatar"

const Response: React.FC = () => {
  return (
    <Card.Root maxW="md" mx="auto" fontFamily="body" variant="subtle">
      <Card.Header>
        <HStack gap={3}>
          <Avatar variant="subtle" name="Anonymous Hippo" />
          <Stack gap={0}>
            <Text textStyle="sm" fontWeight="semibold">
              Anonymous Hippo
            </Text>
            <Text color="muted" textStyle="sm">
              3 hrs ago
            </Text>
          </Stack>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Text fontSize="body.primary">
          Today, I’m grateful for the simple things—a warm cup of coffee, a good
          book I started reading, and a quiet morning to just enjoy both. It’s
          easy to get caught up in the big things, but little moments like these
          feel like gifts.
        </Text>
      </Card.Body>
    </Card.Root>
  )
}

export default Response
