import { useCallback, useEffect, useState } from "react"

import { QOTD, UseMainResults } from "./types"
import { getQOTD, answerQOTD } from "../../utils/api/qotd"
import { toaster } from "../ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { useAuthenticationDialogContext } from "../../contexts/AuthenticationDialogContext"

export const useQOTD = (): UseMainResults => {
  const { user } = useAuthContext()
  const {
    isOpen: authenticationDialogIsOpen,
    promptToSave: authenticationDialogPromptToSave
  } = useAuthenticationDialogContext()

  const [qotd, setQOTD] = useState<QOTD>({
    question: "",
    day: ""
  })
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)

  const submit = useCallback(async () => {
    let authorizationToken = undefined

    // If the user is logged in, get the authorization token
    if (user) {
      authorizationToken = await user.getIdToken()
    } else {
      authenticationDialogIsOpen.update((prevState) => !prevState)
      authenticationDialogPromptToSave.update(true)
    }

    // If the response is empty, display info message prompting user to answer the question
    if (response.trim() === "") {
      toaster.create({
        title: "Please answer the question before submitting.",
        type: "info",
        duration: 3500
      })
      return
    }

    console.log("Submitting answer...", response, qotd.day, authorizationToken)

    // Submit the answer to the backend
    const [error, _] = await answerQOTD(response, qotd.day, authorizationToken)

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

    console.log("Answered question of the day!")
  }, [response])

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const getQuestion = useCallback(async () => {
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

    setQOTD(data)
  }, [])

  // Get question of the day on mount
  useEffect(() => {
    getQuestion()
  }, [])

  return {
    response: {
      value: response,
      update: setResponse
    },
    submit,
    currentDate,
    question: qotd.question,
    loading
  }
}
