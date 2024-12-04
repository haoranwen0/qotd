import axios from "axios"

import {
  ApiResponse,
  GetAnswerForDayResponse,
  TieAnswerToUserResponse
} from "./types"
import { getLocaleDate } from "../utils"
import { Answer } from "../types"

export const getDaysAnswered = async (
  authorizationToken: string
): ApiResponse<string[]> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DEV_API_URL}/days_answered`,
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`
        }
      }
    )
    return [null, response.data as string[]]
  } catch (error) {
    return [error as Error, null]
  }
}

export const getAnswerForDay = async (
  authorizationToken: string,
  day: string
): ApiResponse<string> => {
  try {
    const response = await axios.get<GetAnswerForDayResponse>(
      `${import.meta.env.VITE_DEV_API_URL}/specific_answer/${day}`,
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`
        }
      }
    )

    console.log("getAnswerForDay response: ", response)

    return [null, response.data.answer]
  } catch (error) {
    return [error as Error, null]
  }
}

export const tieAnswerToUser = async (
  authorizationToken: string,
  answerId: string
): ApiResponse<string> => {
  const day = getLocaleDate()

  try {
    const response = await axios.post<TieAnswerToUserResponse>(
      `${import.meta.env.VITE_DEV_API_URL}/tie_answer_to_user/${day}`,
      { answer_id: answerId },
      { headers: { Authorization: `Bearer ${authorizationToken}` } }
    )

    return [null, response.data.message]
  } catch (error) {
    return [error as Error, null]
  }
}
