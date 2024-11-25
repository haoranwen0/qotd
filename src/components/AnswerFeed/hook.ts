import { useCallback, useEffect, useMemo, useState } from "react"

import { useParams } from "react-router-dom"
import { User } from "firebase/auth"
import _ from "lodash"

import { getOtherAnswerIDs, getOtherAnswers } from "../../utils/api/viewOthers"
import { toaster } from "../ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { getLocaleDate } from "../../utils/utils"
import { UseAnswerFeedResults } from "./types"

export const useAnswerFeed = (): UseAnswerFeedResults => {
  // const { user } = useAuthContext()

  const [answerIds, setAnswerIds] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0)
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

  useEffect(() => {
    getOtherAnswerIDsHelper()
  }, [])

  useEffect(() => {
    if (currentAnswerIndex === 0 && answerIds.length > 0) {
      loadNextBatch()
    }
  }, [answerIds])

  const showNextAnswer = () => {
    if (currentAnswerIndex === answerIds.length - 2 && hasMore) {
      loadNextBatch()
    }
    setCurrentAnswerIndex(prev => prev + 1)
  }

  return {
    answerIds,
    answers,
    currentAnswerIndex,
    showNextAnswer,
    loading,
    hasMore
  }
}