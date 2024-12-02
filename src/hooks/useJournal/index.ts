import { useCallback } from "react"

import { useLocalStorage } from "usehooks-ts"

import { HandleJournalSubmission, UseJournalResults } from "./types"
import { useAuthContext } from "../../contexts/AuthContext"
import { CachedQOTD } from "../../components/QOTD/types"
import { toaster } from "../../components/ui/toaster"
import { answerQOTD } from "../../utils/api/qotd"
import { updateThought } from "../../utils/api/thought"

export default function useJournal(): UseJournalResults {
  const { user } = useAuthContext()

  const [cachedThought, setCachedThought] = useLocalStorage("cachedThought", "")
  const [cachedQOTD, setCachedQOTD] = useLocalStorage<CachedQOTD>(
    "cachedQOTD",
    { day: "", question: "", response: "", answer_id: "" }
  )

  const handleJournalSubmission: HandleJournalSubmission = useCallback(
    async (type) => {
      if (user === null) {
        return
      }

      const authorizationToken = await user.getIdToken()

      let error: Error | null = null
      let data: any = null

      if (type === "qotd") {
        ;[error, data] = await answerQOTD(
          cachedQOTD.response,
          cachedQOTD.day,
          authorizationToken
        )
      } else if (type === "thought") {
        ;[error, data] = await updateThought(
          authorizationToken,
          cachedThought,
          cachedQOTD.day
        )
      }

      if (error !== null) {
        toaster.create({
          title: "Error submitting answer.",
          description: error.message,
          type: "error",
          duration: 3500
        })
        return
      }
    },
    [cachedQOTD, cachedThought, user]
  )

  return {
    cachedQOTD,
    cachedThought,
    setCachedQOTD,
    setCachedThought,
    handleJournalSubmission
  }
}
