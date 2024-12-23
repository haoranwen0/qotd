import React from "react"

import {
  Box,
  Text,
  Flex,
  Grid,
  IconButton,
  Card,
  VStack
} from "@chakra-ui/react"
import {
  MdOutlineCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineCalendarToday
} from "react-icons/md"
import { useNavigate } from "react-router-dom"

import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"
import useCalendar from "./hook"
import { monthNames, dayNames } from "../../utils/constants"

const Calendar: React.FC = () => {
  const navigate = useNavigate()
  const {
    currentDate,
    previousMonth,
    nextMonth,
    generateCalendar,
    daysAnswered
  } = useCalendar()

  return (
    <MenuRoot variant="subtle">
      <MenuTrigger
        asChild
        pos="absolute"
        top={{ base: 7, sm: "md" }}
        left={{ base: "auto", sm: "sm" }}
        right={{ base: 20, sm: "auto" }}
      >
        <IconButton
          aria-label="Previous month"
          onClick={() => {
            currentDate.update(new Date())
          }}
          _hover={{ bgColor: "bg-hover" }}
          bgColor="transparent"
          outline="none"
          size="sm"
          variant="ghost"
          mb="xs"
        >
          <MdOutlineCalendarMonth />
        </IconButton>
      </MenuTrigger>
      <MenuContent
        p={0}
        boxShadow="none"
        bgColor="transparent"
        pos={{ base: "absolute", sm: "static" }}
        right={{ base: "0", sm: "auto" }}
        transform={{ base: "translateX(96px)", sm: "none" }}
      >
        <Card.Root maxW="md" bgColor="secondary" variant="subtle">
          <Card.Header p={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="body.primary" fontWeight="bold">
                {monthNames[currentDate.value.getMonth()]}{" "}
                {currentDate.value.getFullYear()}
              </Text>
              <Flex gap={1}>
                <IconButton
                  aria-label="Go to today"
                  onClick={() => {
                    currentDate.update(new Date())
                  }}
                  _hover={{ bgColor: "bg-hover" }}
                  size="sm"
                  variant="ghost"
                  outline="none"
                >
                  <MdOutlineCalendarToday />
                </IconButton>
                <IconButton
                  aria-label="Previous month"
                  onClick={previousMonth}
                  _hover={{ bgColor: "bg-hover" }}
                  size="sm"
                  variant="ghost"
                  outline="none"
                >
                  <MdChevronLeft />
                </IconButton>
                <IconButton
                  aria-label="Next month"
                  _hover={{ bgColor: "bg-hover" }}
                  onClick={nextMonth}
                  size="sm"
                  variant="ghost"
                  outline="none"
                >
                  <MdChevronRight />
                </IconButton>
              </Flex>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            <Grid templateColumns="repeat(7, 1fr)" gap={1}>
              {/* Day names */}
              {dayNames.map((day) => (
                <Box
                  key={day}
                  textAlign="center"
                  // p={2}
                  aspectRatio="square"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.500"
                >
                  {day}
                </Box>
              ))}
              {/* Calendar days */}
              {generateCalendar().map((day, index) => {
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.value.getMonth() === new Date().getMonth() &&
                  currentDate.value.getFullYear() === new Date().getFullYear()

                const isFuture =
                  new Date(
                    currentDate.value.getFullYear(),
                    currentDate.value.getMonth(),
                    day as number
                  ) > new Date()

                const date = `${currentDate.value.getFullYear()}-${
                  currentDate.value.getMonth() + 1
                }-${day}`

                const userHasAnsweredForDay = daysAnswered.has(date)

                return (
                  <VStack
                    key={index}
                    textAlign="center"
                    p={2}
                    gap={0}
                    aspectRatio="square"
                    cursor={day && !isFuture ? "pointer" : "default"}
                    borderRadius="md"
                    bg={isToday ? "accent" : "transparent"}
                    opacity={isFuture ? "0.25" : "1"}
                    color="text"
                    transition="background 150ms ease-in-out"
                    _hover={{
                      bg: day && !isFuture ? "bg-hover" : "transparent"
                    }}
                    fontWeight={isToday ? "semibold" : "normal"}
                    onClick={
                      userHasAnsweredForDay
                        ? () => navigate(`/day/${date}`)
                        : undefined
                    }
                  >
                    <Text>{day}</Text>
                    {userHasAnsweredForDay && (
                      <Box h={1} w={1} bgColor="primary" rounded="full" />
                    )}
                  </VStack>
                )
              })}
            </Grid>
          </Card.Body>
        </Card.Root>
      </MenuContent>
    </MenuRoot>
  )
}

export default Calendar
