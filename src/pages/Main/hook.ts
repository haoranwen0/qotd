import { useCallback, useState } from "react"

import { UseMainResults } from "./types"

export const useMain = (): UseMainResults => {
  const [response, setResponse] = useState("")

  const submit = useCallback(() => {
    console.log("Submitting response!", response)
  }, [response])

  return {
    response: {
      value: response,
      update: setResponse
    },
    submit
  }
}
