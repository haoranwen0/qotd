import { Dispatch, SetStateAction } from "react"

interface ResponseCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface UseMainResults {
  response: ResponseCtrl
  submit: () => void
  currentDate: string
  question: string
  loading: boolean
}

export type { UseMainResults, ResponseCtrl }
