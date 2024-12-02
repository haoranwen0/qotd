import { Dispatch, SetStateAction } from "react"

type UpdateResponse = (e: React.ChangeEvent<HTMLTextAreaElement>) => void

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
  response: string
  currentDate: string
  submitted: boolean
  loading: boolean
  value: QOTD
  updateResponse: UpdateResponse
  submit: () => void
}

export type { UseMainResults, ResponseCtrl, QOTD, CachedQOTD, UpdateResponse }
