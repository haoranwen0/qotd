import { useCallback, useEffect, useState } from "react"

import _ from "lodash"

import { getOtherAnswerIDs, getOtherAnswers } from "../../utils/api/viewOthers"
import { toaster } from "../ui/toaster"
import { getLocaleDate } from "../../utils/utils"
import { UseAnswerFeedResults } from "./types"

export const useAnswerFeed = (): UseAnswerFeedResults => {
  // const { user } = useAuthContext()

  const [answerIds, setAnswerIds] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0)
  const [gotInitialAnswerIds, setGotInitialAnswerIds] = useState(false)
  const [hasDoneInitialFetch, setHasDoneInitialFetch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const BATCH_SIZE = 5

  const getOtherAnswerIDsHelper = useCallback(async () => {
    // if (user === null) {
    //   return
    // }
    // const authorizationToken = await user.getIdToken()
    const [error, data] = await getOtherAnswerIDs(getLocaleDate())

    if (error) {
      toaster.create({
        title: "Error getting other answer IDs",
        description: error.message,
        type: "error",
        duration: 3500
      })
      return
    }

    // TODO
    // Update states associated with the answer
    if (data !== null) {
      setAnswerIds(data)
      setGotInitialAnswerIds(true)
    }
  }, [])

  const getOtherAnswersHelper = useCallback(async (nextIds: string[]) => {
    // if (user === null) {
    //   return
    // }
    // const authorizationToken = await user.getIdToken()

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
    if (gotInitialAnswerIds) {
      if (currentAnswerIndex === 0 && answerIds.length > 0) {
        loadNextBatch()
      }
      setHasDoneInitialFetch(true)
    }
  }, [gotInitialAnswerIds, currentAnswerIndex, answerIds])

  useEffect(() => {
    // Fetch next batch if we're at the second to last answer and there are more answers to fetch
    if (currentAnswerIndex === answers.length - 2 && hasMore) {
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