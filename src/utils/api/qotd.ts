import axios from "axios"

import { ApiResponse } from "./types"
import { QOTD } from "../../components/QOTD/types"

export const getQOTD = async (): ApiResponse<QOTD> => {
  try {
    const response = await axios.get<QOTD>(
      `${import.meta.env.VITE_DEV_API_URL}/qotd`
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
): ApiResponse<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${import.meta.env.VITE_DEV_API_URL}/qotd`,
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
