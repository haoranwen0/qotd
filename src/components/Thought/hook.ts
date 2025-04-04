import { useCallback, useEffect, useState } from "react"

import { useParams } from "react-router-dom"
import _ from "lodash"

import { toaster } from "../ui/toaster"
import { Thought, UseThoughtParams } from "./types"
import { getThought, updateThought } from "../../utils/api/thought"
import { useAuth } from "../../hooks/useAuth"
import { delay } from "../../utils/utils"
import useJournal from "../../hooks/useJournal"

export default function useThought(params: UseThoughtParams) {
  const { qotd } = params
  const { user } = useAuth()
  const { cachedThought, setCachedThought } = useJournal()
  const { day: dayParam } = useParams()

  const [thought, setThought] = useState<Thought>({
    current: "",
    previous: "",
    isSaving: false
  })

  /**
   * Retrieves the user's thought for the current day.
   *
   * If the user is not authenticated, sets the thought state to the cached thought from local storage.
   * If the user is authenticated, fetches their thought from the API using their auth token.
   *
   * On successful API fetch:
   * - Updates the thought state with the fetched thought
   * - Updates the cached thought in local storage
   *
   * On API error:
   * - Displays an error toast notification to the user
   */
  const getThoughtHelper = useCallback(async () => {
    // If the user is not authenticated, set the thought to the cached thought
    if (user === null) {
      setThought({
        current: cachedThought,
        previous: cachedThought,
        isSaving: false
      })
      return
    }

    // Get the day to fetch
    let dayToGet = ""

    // If the day param is undefined, use the QOTD day. Else, use the day param from the URL /day/:day
    if (dayParam === undefined) {
      dayToGet = qotd.day
    } else {
      dayToGet = dayParam
    }

    // If the user is authenticated, get the user's authentication token and fetch the user's thought for today
    const authorizationToken = await user.getIdToken()
    const [error, data] = await getThought(authorizationToken, dayToGet)

    // If there is an error, display error message
    if (error !== null) {
      toaster.create({
        title: "Error fetching your thoughts for today.",
        description: error.message,
        type: "error",
        duration: 3500
      })
    }

    // If the fetch was successful, set the thought
    if (data !== null) {
      setThought({
        current: data.thought ?? "",
        previous: data.thought ?? "",
        isSaving: false
      })
      setCachedThought(data.thought ?? "")
    }
  }, [user, cachedThought, dayParam, qotd.day])

  const saveThoughtHelper = useCallback(
    async (currentValue: string) => {
      // If the user is not logged in or there is not change in thought input, return
      if (user === null) return
      if (currentValue === thought.previous) return

      let dayToUpdate = ""

      // If the day param is undefined, use the QOTD day. Else, use the day param from the URL /day/:day
      if (dayParam === undefined) {
        dayToUpdate = qotd.day
      } else {
        dayToUpdate = dayParam
      }

      // Get the user's authentication token and update the thought
      const authorizationToken = await user.getIdToken()
      const [error, _] = await updateThought(
        authorizationToken,
        currentValue,
        dayToUpdate
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
    },
    [user, qotd, thought, dayParam]
  )

  const debouncedSave = useCallback(_.debounce(saveThoughtHelper, 2500), [
    saveThoughtHelper
  ])

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

  // Fetch the user's thought for today
  useEffect(() => {
    getThoughtHelper()
  }, [dayParam, user])

  return {
    thought: {
      value: thought,
      update: setThought
    },
    cachedThought: {
      value: cachedThought,
      update: setCachedThought
    }
  }
}
