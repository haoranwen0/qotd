import { Answer } from "../types"

export type ApiResponse<T> = Promise<[Error | null, null | T]>

export interface AnswerQOTDResponse {
  answer_id: string
}

export interface UpdateThoughtResponse {
  thought_id: string
}

export interface GetAnswerForDayResponse {
  answer: string
}
