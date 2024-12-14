export type ApiResponse<T> = Promise<[Error | null, null | T]>

export interface AnswerQOTDResponse {
  answer_id: string
}

export interface UpdateThoughtResponse {
  thought_id: string
}

export interface GetAnswerForDayResponse {
  answer: string | null
  answer_id: string | null
}

export interface GetThoughtResponse {
  thought: string
}

export interface TieAnswerToUserResponse {
  message: string
}
