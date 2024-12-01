import { useCallback, useEffect, useMemo, useState } from "react"

import { useParams, useNavigate } from "react-router-dom"
import { User } from "firebase/auth"
import { useLocalStorage } from "usehooks-ts"
import _ from "lodash"

import { CachedQOTD, QOTD, Thought, UseMainResults } from "./types"
import { getQOTD, answerQOTD } from "../../utils/api/qotd"
import { toaster } from "../ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { useAuthenticationDialogContext } from "../../contexts/AuthenticationDialogContext"
import { updateThought } from "../../utils/api/thought"
import { getAnswerForDay } from "../../utils/api/answers"
import { delay, getLocaleDate } from "../../utils/utils"

export const useQOTD = (): UseMainResults => {
  // Hooks
  const navigate = useNavigate()
  const { day: dayParam } = useParams()
  const { user } = useAuthContext()
  const {
    isOpen: authenticationDialogIsOpen,
    promptToSave: authenticationDialogPromptToSave
  } = useAuthenticationDialogContext()

  // States
  const [cachedQOTD, setCachedQOTD] = useLocalStorage<CachedQOTD>(
    "cachedQOTD",
    // Default value
    { day: "", question: "", response: "", answer_id: "" }
  )
  const [qotd, setQOTD] = useState<QOTD>({ question: "", day: "" })
  const [response, setResponse] = useState("")
  const [thought, setThought] = useState<Thought>({
    current: "",
    previous: "",
    isSaving: false
  })
  const [loading, setLoading] = useState(true)

  const isToday = useMemo(() => {
    return dayParam === undefined
  }, [dayParam])

  const userHasSubmittedResponse = useMemo(() => {
    if (isToday) {
      return (
        cachedQOTD.day === qotd.day &&
        cachedQOTD.response !== "" &&
        cachedQOTD.answer_id !== ""
      )
    }

    // Return true if not today. Assumes that the user only lands on /day/{some date} through the calendar on a date that they answered
    return true
  }, [cachedQOTD, qotd.day, isToday])

  const debouncedSave = useCallback(
    _.debounce(async (currentValue: string) => {
      // If the user is not logged in or there is not change in thought input, return
      if (user === null) return
      if (currentValue === thought.previous) return

      // Get the user's authentication token and update the thought
      const authorizationToken = await user.getIdToken()

      const [error, _] = await updateThought(
        authorizationToken,
        currentValue,
        qotd.day
      )

      // If there is an error, display error message
      if (error) {
        toaster.create({
          title: "Error saving your thoughts.",
          description: error.message,
          type: "error",
          duration: 3500
        })
        return
      }

      // If the update was successful, i.e. no error update the previous and current values for thought
      console.log("successfully saved thought!")

      // Set saving to true
      setThought((prevState) => ({
        ...prevState,
        previous: currentValue,
        isSaving: true
      }))

      // Shows the text "Saved!" for 2 seconds
      await delay(2000)

      // Set saving to false
      setThought((prevState) => ({
        ...prevState,
        isSaving: false
      }))
    }, 2500),
    [thought, user, qotd]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  useEffect(() => {
    if (thought.current !== thought.previous) {
      debouncedSave(thought.current)
    }
  }, [thought, debouncedSave])

  const submitHelper = useCallback(
    async (userObject: User | null) => {
      let authorizationToken = undefined

      // If the user is logged in, get the authorization token
      if (userObject) {
        authorizationToken = await userObject.getIdToken()
      }

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
    } else {
      await submitHelper(user)
    }
  }, [response])

  /* If the authentication dialog is open and the prompt to save is true, submit the answer.
   * This happens when an authenticated user answers the question. The authentication dialog
   * pops up to prompt to them sign in / sign up. Then, submit the answer with either the uid
   * or null (depending on whether they authenticate or nor).
   */
  useEffect(() => {
    void (async () => {
      if (
        authenticationDialogIsOpen.value !== true &&
        authenticationDialogPromptToSave.value === true
      ) {
        await submitHelper(user)
      }
    })()
  }, [
    authenticationDialogIsOpen.value,
    authenticationDialogPromptToSave.value,
    user
  ])

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }, [])

  const getQOTDHelper = useCallback(async () => {
    let dayToGet = isToday ? getLocaleDate() : dayParam

    console.log("Fetching question for day")

    const [error, data] = await getQOTD(dayToGet)

    setLoading(false)

    if (error) {
      toaster.create({
        title: `Error getting question ${
          isToday ? "of today" : "for the day"
        }.`,
        description: error.message,
        type: "error",
        duration: 3500
      })
      return
    }

    if (data !== null) {
      setQOTD(data)
      if (isToday) {
        if (cachedQOTD.day !== data.day) {
          setCachedQOTD({
            ...data,
            answer_id: "",
            response: ""
          })
        } else {
          setResponse(cachedQOTD.response)
        }
      }
    }
  }, [cachedQOTD, isToday, dayParam])

  const getAnswerForDayHelper = useCallback(async () => {
    if (user === null) {
      return
    }

    const authorizationToken = await user.getIdToken()
    const dayToGet = isToday ? getLocaleDate() : dayParam

    const [error, data] = await getAnswerForDay(
      authorizationToken,
      dayToGet as string
    )

    if (error) {
      toaster.create({
        title: "Error getting answer for day",
        description: error.message,
        type: "error",
        duration: 3500
      })
      return
    }

    console.log("Got answer for day", data)

    // TODO
    // Update states associated with the answer
    if (data !== null) {
      setResponse(data)
    }
  }, [cachedQOTD])

  /*
   * Get the question of the day
   */
  useEffect(() => {
    void (async () => {
      await getQOTDHelper()
      await getAnswerForDayHelper()
    })()
  }, [dayParam])

  useEffect(() => {
    console.log(response)
  }, [response])

  return {
    response: {
      value: response,
      update: setResponse
    },
    thought: {
      value: thought,
      update: setThought
    },
    submit,
    submitted: userHasSubmittedResponse,
    currentDate,
    question: qotd.question,
    loading,
    navigate
  }
}
