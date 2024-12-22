import { Dispatch, SetStateAction } from "react"

export type PreviousMonth = () => void
export type NextMonth = () => void
export type GenerateCalendar = () => (number | null)[]
export type DaysAnswered = Set<string>

export interface UseCalendarResults {
  currentDate: {
    value: Date
    update: Dispatch<SetStateAction<Date>>
  }
  previousMonth: PreviousMonth
  nextMonth: NextMonth
  generateCalendar: GenerateCalendar
  daysAnswered: DaysAnswered
}
