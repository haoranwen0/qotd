import axios from "axios"

import { ApiResponse, GetThoughtResponse } from "./types"
import { UpdateThoughtResponse } from "./types"

export const updateThought = async (
  authorizationToken: string,
  thought: string,
  day: string
): ApiResponse<UpdateThoughtResponse> => {
  try {
    const response = await axios.put<UpdateThoughtResponse>(
      `${import.meta.env.VITE_API_URL}/thought/${day}`,
      {
        thought
      },
      // If authorization token is provided, add it to the headers
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`
        }
      }
    )
    return [null, response.data]
  } catch (error) {
    return [error as Error, null]
  }
}

export const getThought = async (
  authorizationToken: string,
  day: string
): ApiResponse<GetThoughtResponse> => {
  try {
    const response = await axios.get<GetThoughtResponse>(
      `${import.meta.env.VITE_API_URL}/thought/${day}`,
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`
        }
      }
    )
    return [null, response.data]
  } catch (error) {
    return [error as Error, null]
  }
}
