export type ApiResponse<T> = Promise<[Error | null, null | T]>

export interface AnswerQOTDResponse {
  answer_id: string
}
