import type { Dispatch, SetStateAction } from "react"

import { User } from "firebase/auth"

import { CachedQOTD } from "../../components/QOTD/types"

type HandleJournalSubmission = (
  userObject: User | null,
  type: "qotd" | "thought"
) => Promise<void>

interface UseJournalResults {
  cachedQOTD: CachedQOTD
  cachedThought: string
  setCachedQOTD: Dispatch<SetStateAction<CachedQOTD>>
  setCachedThought: Dispatch<SetStateAction<string>>
  handleJournalSubmission: HandleJournalSubmission
}

export type { HandleJournalSubmission, UseJournalResults }
