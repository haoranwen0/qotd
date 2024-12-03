import { UpdateResponse } from "../QOTD/types"

interface QuestionInputProps {
  response: string
  updateResponse: UpdateResponse
  disabled?: boolean
}

export type { QuestionInputProps }
