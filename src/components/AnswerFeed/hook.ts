import React, { useCallback, useEffect, useMemo, useState } from "react"

import { useParams } from "react-router-dom"
import { User } from "firebase/auth"
import _ from "lodash"

import { CachedQOTD, QOTD, Thought, UseMainResults } from "./types"
import { getOtherAnswerIDs, getOtherAnswers } from "../../utils/api/viewOthers"
import { toaster } from "../ui/toaster"
import { useAuthContext } from "../../contexts/AuthContext"
import { getAnswerForDay } from "../../utils/api/answers"
import { delay, getLocaleDate } from "../../utils/utils"

export const useAnswerFeed = (): UseMainResults => {
  const { day: dayParam } = useParams()
  const { user } = useAuthContext()

  const [answerIds, setAnswerIds] = React.useState<string[]>([])
  const [answers, setAnswers] = React.useState<string[]>([])
  const [currentAnswerIndex, setCurrentAnswerIndex] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

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

  React.useEffect(() => {
    loadNextBatch()
  }, [])

  const showNextAnswer = () => {
    if (currentAnswerIndex === answers.length - 2 && hasMore) {
      loadNextBatch()
    }
    setCurrentAnswerIndex(prev => prev + 1)
  }

  const currentAnswer = answers[currentAnswerIndex]

  const isToday = dayParam === undefined

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  /*
   * Get the question of the day
   */
  useEffect(() => {
    void (async () => {
      await getQOTDHelper()
      if (!isToday) {
        await getAnswerForDayHelper()
      }
    })()
  }, [dayParam])

  useEffect(() => {
    console.log(response)
  }, [response])

  return {
    answers,
    currentAnswer
    currentAnswerIndex,
    loading,
    hasMore
  }
}