interface UseAnswerFeedResults {
  answerIds: string[],
  answers: string[],
  currentAnswerIndex: number,
  showNextAnswer: () => void,
  loading: boolean,
  hasMore: boolean
}

export type {
  UseAnswerFeedResults
}