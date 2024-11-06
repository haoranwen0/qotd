import React, { useState } from "react"
import { Box, Text, Flex, Grid, IconButton, Card } from "@chakra-ui/react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

import { useColorModeValue } from "../ui/color-mode"

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

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
  const todayBg = useColorModeValue("blue.100", "blue.800")
  const todayColor = useColorModeValue("blue.600", "blue.200")

  return (
    <Card.Root maxW="md" mx="auto" fontFamily="body">
      <Card.Header p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="body.primary" fontWeight="bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <Flex gap={1}>
            <IconButton
              aria-label="Previous month"
              onClick={previousMonth}
              size="sm"
              variant="outline"
            >
              <MdChevronLeft />
            </IconButton>
            <IconButton
              aria-label="Next month"
              onClick={nextMonth}
              size="sm"
              variant="outline"
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

            return (
              <Box
                key={index}
                textAlign="center"
                p={2}
                cursor={day ? "pointer" : "default"}
                borderRadius="md"
                bg={isToday ? todayBg : "transparent"}
                color={isToday ? todayColor : day ? "inherit" : "gray.300"}
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
  )
}

export default Calendar
