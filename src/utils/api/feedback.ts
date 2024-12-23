import axios, { AxiosError } from "axios"

import { ApiResponse, CollectFeedbackResponse } from "./types"

export const collectFeedback = async (
  rating: string,
  feedback: string
): ApiResponse<CollectFeedbackResponse> => {
  try {
    const response = await axios.post<CollectFeedbackResponse>(
      `${import.meta.env.VITE_API_URL}/feedback`,
      { rating, feedback }
    )
    return [null, response.data]
  } catch (error) {
    return [error as AxiosError, null]
  }
}
