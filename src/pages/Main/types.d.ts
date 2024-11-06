interface ResponseCtrl {
  value: string
  update: Dispatch<SetStateAction<string>>
}

interface UseMainResults {
  response: ResponseCtrl
  submit: () => void
}

export type { UseMainResults }
