export type ApiResponse<T> = Promise<[Error | null, null | T]>
