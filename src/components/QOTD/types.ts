import { Dispatch, SetStateAction } from "react"

interface QOTD {
  question: string
  day: string
}

interface ResponseCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface CachedQOTD extends QOTD {
  response: string
  answer_id: string
}

interface UseMainResults {
  response: ResponseCtrl
  submit: () => void
  currentDate: string
  submitted: boolean
  question: string
  loading: boolean
}

export type { UseMainResults, ResponseCtrl, QOTD, CachedQOTD }
