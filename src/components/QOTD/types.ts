import { Dispatch, SetStateAction } from "react"
import { NavigateFunction } from "react-router-dom"

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
  navigate: NavigateFunction
}

export type {
  UseMainResults,
  ResponseCtrl,
  ThoughtCtrl,
  QOTD,
  CachedQOTD,
  Thought
}
