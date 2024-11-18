import axios from "axios"
import { ApiResponse } from "./types"

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
