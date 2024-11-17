import { useCallback, useEffect, useState } from "react"

import { UseMainResults } from "./types"
import { getQOTD } from "../../utils/api/qotd"
import { toaster } from "../ui/toaster"

export const useQOTD = (): UseMainResults => {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)

  const submit = useCallback(() => {
    console.log("Submitting response!", response)
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

    setQuestion(data.question)
  }, [])

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
    question,
    loading
  }
}
