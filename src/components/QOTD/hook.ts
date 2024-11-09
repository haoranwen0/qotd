import { useCallback, useState } from "react"

import { UseMainResults } from "./types"

export const useQOTD = (): UseMainResults => {
  const [response, setResponse] = useState("")

  const submit = useCallback(() => {
    console.log("Submitting response!", response)
  }, [response])

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return {
    response: {
      value: response,
      update: setResponse
    },
    submit,
    currentDate
  }
}
