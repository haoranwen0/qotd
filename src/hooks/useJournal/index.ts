import { useCallback } from "react"

import { useLocalStorage } from "usehooks-ts"

import { CachedQOTD } from "../../components/QOTD/types"
import { toaster } from "../../components/ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { tieAnswerToUser } from "../../utils/api/answers"
import { updateThought } from "../../utils/api/thought"
import { HandleJournalSubmission, UseJournalResults } from "./types"

export default function useJournal(): UseJournalResults {
  const { user } = useAuthContext()

  const [cachedThought, setCachedThought] = useLocalStorage("cachedThought", "")
  const [cachedQOTD, setCachedQOTD] = useLocalStorage<CachedQOTD>(
    "cachedQOTD",
    { day: "", question: "", response: "", answer_id: "" }
  )

  const handleJournalSubmission: HandleJournalSubmission = useCallback(
    async (userObject, type) => {
      // Don't submit under these conditions
      // 1. User is not authenticated
      // 2. User has not answered the QOTD (Missing answer_id)
      // 3. User has not entered a thought
      if (
        userObject === null ||
        cachedQOTD.answer_id === "" ||
        cachedThought.trim() === ""
      ) {
        return
      }

      const authorizationToken = await userObject.getIdToken()

      let error: Error | null = null
      let data: any = null

      if (type === "qotd") {
        ;[error, data] = await tieAnswerToUser(
          authorizationToken,
          cachedQOTD.answer_id
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
