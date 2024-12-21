import { Dispatch, SetStateAction } from "react"
import { NavigateFunction } from "react-router-dom"

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
  isPublic: boolean
  updateIsPublic: () => void
  updateResponse: UpdateResponse
  submit: () => void
  navigate: NavigateFunction
}

export type { UseMainResults, ResponseCtrl, QOTD, CachedQOTD, UpdateResponse }
