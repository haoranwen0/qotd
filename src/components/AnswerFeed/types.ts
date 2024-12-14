interface UseAnswerFeedResults {
  answerIds: string[],
  answers: string[],
  currentAnswerIndex: number,
  showNextAnswer: () => void,
  loading: boolean,
  hasMore: boolean,
  hasDoneInitialFetch: boolean
}

export type {
  UseAnswerFeedResults
}