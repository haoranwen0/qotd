import axios from "axios"

import { AnswerQOTDResponse, ApiResponse } from "./types"
import { getLocaleDate } from "../utils"
import { QOTD } from "../../components/QOTD/types"

/**
 * Fetches the Question of the Day (QOTD) from the API.
 *
 * @param day - Optional. The specific date for which to fetch the QOTD. If not provided, defaults to the current date.
 * @returns A Promise that resolves to an ApiResponse containing either the QOTD or an Error.
 */
export const getQOTD = async (day?: string): ApiResponse<QOTD> => {
  let dayToGet = getLocaleDate()

  if (day !== undefined) {
    dayToGet = day
  }

  try {
    const response = await axios.get<QOTD>(
      `${import.meta.env.VITE_DEV_API_URL}/qotd/${dayToGet}`
    )
    return [null, response.data]
  } catch (error) {
    return [error as Error, null]
  }
}

/**
 * Sends an answer to the Question of the Day (QOTD).
 *
 * @param answer - The answer to the QOTD.
 * @param day - The day for which the answer is being submitted.
 * @param authorizationToken - Optional. The authorization token for authentication.
 * @returns A Promise that resolves to an ApiResponse containing either the answer or an Error.
 */
export const answerQOTD = async (
  answer: string,
  day: string,
  authorizationToken?: string
): ApiResponse<AnswerQOTDResponse> => {
  try {
    const response = await axios.post<AnswerQOTDResponse>(
      `${import.meta.env.VITE_DEV_API_URL}/qotd/${getLocaleDate()}`,
      { answer, day },
      // If authorization token is provided, add it to the headers
      {
        ...(authorizationToken && {
          headers: {
            Authorization: `Bearer ${authorizationToken}`
          }
        })
      }
    )
    return [null, response.data]
  } catch (error) {
    return [error as Error, null]
  }
}
