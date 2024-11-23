import axios from "axios"

import { ApiResponse } from "./types"

/**
 * Fetches list of other people's answer IDs for a given day from the API.
 *
 * @param day - Required. The specific date for which to fetch the QOTD.
 * @returns A Promise that resolves to an ApiResponse containing either the answer IDs or an Error.
 */
export const getOtherAnswerIDs = async (day: string): ApiResponse<string[]> => {
    try {
        const response = await axios.get<string[]>(
            `${import.meta.env.VITE_DEV_API_URL}/answer_ids_for_question/${day}`
        )
        return [null, response.data]
    } catch (error) {
        return [error as Error, null]
    }
}

/**
 * Fetches other people's actual answers for a list of answer IDs from the API.
 *
 * @param answerIDs - Required. List of answer IDs to fetch the answers for.
 * @returns A Promise that resolves to an ApiResponse containing either the answers or an Error.
 */
export const getOtherAnswers = async (answerIDs: string[]): ApiResponse<string[]> => {
    try {
        const response = await axios.get<string[]>(
            `${import.meta.env.VITE_DEV_API_URL}/answers_for_answer_ids/${answerIDs}`
        )
        return [null, response.data]
    } catch (error) {
        return [error as Error, null]
    }
}