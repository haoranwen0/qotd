import { useCallback, useEffect, useState } from "react"

import {
  PreviousMonth,
  NextMonth,
  GenerateCalendar,
  UseCalendarResults
} from "./types"
import { getDaysAnswered } from "../../utils/api/answers"
import { useAuthContext } from "../../contexts/AuthContext"
import { toaster } from "../ui/toaster"

export default function useCalendar(): UseCalendarResults {
  const { user } = useAuthContext()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [daysAnswered, setDaysAnswered] = useState<Set<string>>(new Set())

  // Calendar helper functions
  const getDaysInMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }, [])

  const getFirstDayOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }, [])

  // Navigation functions
  const previousMonth: PreviousMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )
  }, [currentDate])

  const nextMonth: NextMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    )
  }, [currentDate])

  // Generate calendar data
  const generateCalendar: GenerateCalendar = useCallback(() => {
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
  }, [currentDate])

  useEffect(() => {
    void (async () => {
      if (user) {
        const authorizationToken = await user.getIdToken()

        const [error, data] = await getDaysAnswered(authorizationToken)

        // If there is an error, show user the error
        if (error) {
          toaster.create({
            title: "Error getting days answered",
            description: error.message,
            duration: 3500,
            type: "error"
          })
        }

        // If there is valid data, set daysAnswered
        if (data !== null) {
          setDaysAnswered(new Set(data))
        }
      }
    })()
  }, [user])

  return {
    currentDate: { value: currentDate, update: setCurrentDate },
    previousMonth,
    nextMonth,
    generateCalendar,
    daysAnswered
  }
}
