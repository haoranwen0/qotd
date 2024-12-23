import { useCallback, useEffect, useState } from "react"

import _ from "lodash"

import { getOtherAnswerIDs, getOtherAnswers } from "../../utils/api/viewOthers"
import { toaster } from "../ui/toaster"
import { UseAnswerFeedResults } from "./types"
import { useParams } from "react-router-dom"

export const useAnswerFeed = (): UseAnswerFeedResults => {
  // const { user } = useAuthContext()
  const { day } = useParams()

  const [answerIds, setAnswerIds] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0)
  const [hasDoneInitialFetch, setHasDoneInitialFetch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const BATCH_SIZE = 5

  const getOtherAnswerIDsHelper = useCallback(async () => {
    // if (user === null) {
    //   return
    // }
    // const authorizationToken = await user.getIdToken()
    if (day === undefined) {
      toaster.create({
        title: "Day is undefined when getting other answer IDs",
        description: "Day is undefined",
        type: "error",
        duration: 3500
      })
      return
    }
    const [error, data] = await getOtherAnswerIDs(day)

    if (error) {
      toaster.create({
        title: "Error getting other answer IDs",
        description: error.message,
        type: "error",
        duration: 3500
      })
      return
    }

    console.log("Got random answer IDs", data)

    // TODO
    // Update states associated with the answer
    if (data !== null) {
      setAnswerIds(data)
    }
  }, [])

  const getOtherAnswersHelper = useCallback(async (nextIds: string[]) => {
    // if (user === null) {
    //   return
    // }
    // const authorizationToken = await user.getIdToken()
    console.log("Getting other answers", nextIds)

    const [error, data] = await getOtherAnswers(nextIds)

    if (error) {
      toaster.create({
        title: "Error getting other answers",
        description: error.message,
        type: "error",
        duration: 3500
      })
      return
    }

    console.log("Got actual answers", data)

    // TODO
    // Update states associated with the answer
    if (data !== null) {
      return data
    }
  }, [answerIds])

  const loadNextBatch = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    const startIndex = answers.length
    const nextIds = answerIds.slice(startIndex, startIndex + BATCH_SIZE)

    try {
      const newAnswers = await getOtherAnswersHelper(nextIds)
      if (newAnswers !== undefined) {
        setAnswers(prev => [...prev, ...newAnswers])
      }

      if (startIndex + BATCH_SIZE >= answerIds.length) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching answers:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch answer IDs on mount
  useEffect(() => {
    getOtherAnswerIDsHelper()
  }, [])

  // Fetch initial batch on mount after answer IDs are fetched
  useEffect(() => {
    if (currentAnswerIndex === 0 && answerIds.length > 0) {
      loadNextBatch()
      setHasDoneInitialFetch(true)
    }
  }, [answerIds])

  useEffect(() => {
    // Fetch next batch if we're at the second to last answer and there are more answers to fetch
    if (currentAnswerIndex === answers.length - 2 && hasMore) {
      console.log("Loading next batch")
      loadNextBatch()
    }
  }, [currentAnswerIndex])

  const showNextAnswer = () => {
    setCurrentAnswerIndex(prev => prev + 1)
  }

  return {
    answerIds,
    answers,
    currentAnswerIndex,
    showNextAnswer,
    hasDoneInitialFetch,
    loading,
    hasMore
  }
}