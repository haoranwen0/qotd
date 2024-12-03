import type { Dispatch, SetStateAction } from "react"

import { QOTD } from "../QOTD/types"

interface ThoughtProps {
  qotdSubmitted: boolean
  qotd: QOTD
}

interface Thought {
  current: string
  previous: string
  isSaving: boolean
}

interface CachedThoughtCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface ThoughtCtrl {
  value: Thought
  update: Dispatch<SetStateAction<Thought>>
}

interface UseThoughtParams {
  qotd: QOTD
}

interface UseThoughtResults {
  thought: {
    value: Thought
    update: Dispatch<SetStateAction<Thought>>
  }
}

export type {
  ThoughtProps,
  Thought,
  ThoughtCtrl,
  UseThoughtParams,
  UseThoughtResults,
  CachedThoughtCtrl
}
