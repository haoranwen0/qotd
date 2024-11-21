import axios from "axios"

import { ApiResponse } from "./types"
import { UpdateThoughtResponse } from "./types"

export const updateThought = async (
  authorizationToken: string,
  thought: string,
  day: string
): ApiResponse<UpdateThoughtResponse> => {
  try {
    const response = await axios.put<UpdateThoughtResponse>(
      `${import.meta.env.VITE_DEV_API_URL}/thought`,
      {
        thought,
        day
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
