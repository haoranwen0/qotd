import { useCallback, useEffect, useState } from "react"

import { useLocalStorage } from "usehooks-ts"

import { CachedQOTD, QOTD, UseMainResults } from "./types"
import { getQOTD, answerQOTD } from "../../utils/api/qotd"
import { toaster } from "../ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { useAuthenticationDialogContext } from "../../contexts/AuthenticationDialogContext"
import { User } from "firebase/auth"

export const useQOTD = (): UseMainResults => {
  const { user } = useAuthContext()
  const {
    isOpen: authenticationDialogIsOpen,
    promptToSave: authenticationDialogPromptToSave
  } = useAuthenticationDialogContext()

  const [cachedQOTD, setCachedQOTD] = useLocalStorage<CachedQOTD>(
    "cachedQOTD",
    {
      // Default value
      day: "",
      question: "",
      response: "",
      answer_id: ""
    }
  )

  const [qotd, setQOTD] = useState<QOTD>({
    question: "",
    day: ""
  })
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)

  const submitHelper = useCallback(
    async (userObject: User | null) => {
      let authorizationToken = undefined

      // If the user is logged in, get the authorization token
      if (userObject) {
        authorizationToken = await userObject.getIdToken()
      }

      console.log(
        "Submitting answer...",
        response,
        qotd.day,
        authorizationToken
      )

      // Submit the answer to the backend
      const [error, data] = await answerQOTD(
        response,
        qotd.day,
        authorizationToken
      )

      // If there is an error, display error message
      if (error) {
        toaster.create({
          title: "Error submitting answer.",
          description: error.message,
          type: "error",
          duration: 3500
        })
        return
      }

      if (data !== null) {
        setCachedQOTD({
          ...cachedQOTD,
          response,
          answer_id: data.answer_id
        })
      }

      authenticationDialogPromptToSave.update(false)
    },
    [qotd, response]
  )

  /* If the authentication dialog is open and the prompt to save is true, submit the answer.
   * This happens when an authenticated user answers the question. The authentication dialog
   * pops up to prompt to them sign in / sign up. Then, submit the answer with either the uid
   * or null (depending on whether they authenticate or nor).
   */
  useEffect(() => {
    console.log(
      "Trying to submit answer...",
      authenticationDialogIsOpen.value,
      authenticationDialogPromptToSave.value
    )
    void (async () => {
      if (
        authenticationDialogIsOpen.value !== true &&
        authenticationDialogPromptToSave.value === true
      ) {
        console.log(
          "Submitting answer after authentication dialog has been closed."
        )
        await submitHelper(user)
      }
    })()
  }, [
    authenticationDialogIsOpen.value,
    authenticationDialogPromptToSave.value,
    user
  ])

  const submit = useCallback(async () => {
    // If the response is empty, display info message prompting user to answer the question
    if (response.trim() === "") {
      toaster.create({
        title: "Please answer the question before submitting.",
        type: "info",
        duration: 3500
      })
      return
    }

    if (!user) {
      authenticationDialogIsOpen.update(true)
      authenticationDialogPromptToSave.update(true)
    }
  }, [response])

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Get question of the day on mount
  useEffect(() => {
    void (async () => {
      const [error, data] = await getQOTD()

      setLoading(false)

      if (error) {
        toaster.create({
          title: "Error getting question of the day.",
          description: error.message,
          type: "error",
          duration: 3500
        })
        return
      }

      if (data !== null) {
        setQOTD(data)
        if (cachedQOTD.day !== data.day) {
          setCachedQOTD({
            ...cachedQOTD,
            day: data.day,
            question: data.question
          })
        }
      }
    })()
  }, [])

  return {
    response: {
      value: response,
      update: setResponse
    },
    submit,
    submitted: cachedQOTD.response !== "",
    currentDate,
    question: qotd.question,
    loading
  }
}
