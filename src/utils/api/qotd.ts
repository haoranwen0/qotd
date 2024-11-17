import axios from "axios"

export const getQOTD = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_DEV_API_URL}/qotd`)
    return [null, response.data]
  } catch (error) {
    return [error, null]
  }
}
