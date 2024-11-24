import { Dispatch, SetStateAction } from "react"

interface QOTD {
  question: string
  day: string
}

interface ResponseCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface Thought {
  current: string
  previous: string
  isSaving: boolean
}

interface ThoughtCtrl {
  value: Thought
  update: Dispatch<SetStateAction<Thought>>
}

interface CachedQOTD extends QOTD {
  response: string
  answer_id: string
}

interface UseMainResults {
  response: ResponseCtrl
  thought: ThoughtCtrl
  submit: () => void
  currentDate: string
  submitted: boolean
  question: string
  loading: boolean
}

export type {
  UseMainResults,
  ResponseCtrl,
  ThoughtCtrl,
  QOTD,
  CachedQOTD,
  Thought
}
