interface ResponseCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface UseMainResults {
  response: ResponseCtrl
  submit: () => void
  currentDate: string
}

export type { UseMainResults }
