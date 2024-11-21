import axios from "axios"

import { AnswerQOTDResponse, ApiResponse } from "./types"
import { getLocaleDate } from "../utils"
import { QOTD } from "../../components/QOTD/types"

export const getQOTD = async (): ApiResponse<QOTD> => {
  try {
    const response = await axios.get<QOTD>(
      `${import.meta.env.VITE_DEV_API_URL}/qotd/${getLocaleDate()}`
    )
    return [null, response.data]
  } catch (error) {
    return [error as Error, null]
  }
}

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
