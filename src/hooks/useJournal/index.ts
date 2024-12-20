import { useCallback } from "react"

import { useLocalStorage } from "usehooks-ts"

import { CachedQOTD } from "../../components/QOTD/types"
import { toaster } from "../../components/ui/toaster"
import { tieAnswerToUser } from "../../utils/api/answers"
import { updateThought } from "../../utils/api/thought"
import { HandleJournalSubmission, UseJournalResults } from "./types"

export default function useJournal(): UseJournalResults {
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
        (type === "qotd" && cachedQOTD.answer_id === "") ||
        (type === "thought" && cachedThought.trim() === "")
      ) {
        return
      }

      const authorizationToken = await userObject.getIdToken()

      let error: Error | null = null
      // let data: any = null

      if (type === "qotd") {
        error = (
          await tieAnswerToUser(authorizationToken, cachedQOTD.answer_id)
        )[0]
      } else if (type === "thought") {
        error = (
          await updateThought(authorizationToken, cachedThought, cachedQOTD.day)
        )[0]
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
    [cachedQOTD, cachedThought]
  )

  return {
    cachedQOTD,
    cachedThought,
    setCachedQOTD,
    setCachedThought,
    handleJournalSubmission
  }
}
