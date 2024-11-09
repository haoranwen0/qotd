import React, { useState } from "react"
import { Box, Text, Flex, Grid, IconButton, Card } from "@chakra-ui/react"
import {
  MdOutlineCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineCalendarToday
  // MdOutlineCalendarViewMonth
} from "react-icons/md"

import { useColorModeValue } from "../ui/color-mode"

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState<boolean>(false)

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    )
  }

  // Generate calendar data
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Chakra UI color mode values
  const bgHover = useColorModeValue("gray.100", "whiteAlpha.200")

  return (
    <Box pos="absolute" top="sm" left="sm">
      <IconButton
        aria-label="Previous month"
        onClick={() => {
          setShowCalendar((prevState) => !prevState)
          setCurrentDate(new Date())
        }}
        _hover={{ bgColor: "secondary" }}
        size="sm"
        variant="ghost"
        mb="xs"
      >
        <MdOutlineCalendarMonth />
      </IconButton>
      {showCalendar && (
        <Card.Root
          maxW="md"
          fontFamily="body"
          bgColor="secondary"
          variant="subtle"
        >
          <Card.Header p={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="body.primary" fontWeight="bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>
              <Flex gap={1}>
                <IconButton
                  aria-label="Go to today"
                  onClick={() => {
                    setCurrentDate(new Date())
                  }}
                  _hover={{ bgColor: "background" }}
                  size="sm"
                  variant="ghost"
                >
                  <MdOutlineCalendarToday />
                </IconButton>
                <IconButton
                  aria-label="Previous month"
                  onClick={previousMonth}
                  _hover={{ bgColor: "background" }}
                  size="sm"
                  variant="ghost"
                >
                  <MdChevronLeft />
                </IconButton>
                <IconButton
                  aria-label="Next month"
                  _hover={{ bgColor: "background" }}
                  onClick={nextMonth}
                  size="sm"
                  variant="ghost"
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
                  p={2}
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
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()

                const isFuture =
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day as number
                  ) > new Date()

                return (
                  <Box
                    key={index}
                    textAlign="center"
                    p={2}
                    aspectRatio="square"
                    cursor={day ? "pointer" : "default"}
                    borderRadius="md"
                    bg={
                      isToday
                        ? "accent"
                        : isFuture
                        ? "background"
                        : "transparent"
                    }
                    opacity={isFuture ? "0.25" : "1"}
                    color="text"
                    transition="background 150ms ease-in-out"
                    _hover={{
                      bg: day ? bgHover : "transparent"
                    }}
                    fontWeight={isToday ? "semibold" : "normal"}
                  >
                    {day}
                  </Box>
                )
              })}
            </Grid>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  )
}

export default Calendar
