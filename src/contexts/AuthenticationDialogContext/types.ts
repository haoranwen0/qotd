import { Dispatch, SetStateAction } from "react"

export interface AuthenticationDialogContextType {
  isOpen: {
    value: boolean
    update: Dispatch<SetStateAction<boolean>>
  }
  promptToSave: {
    value: boolean
    update: Dispatch<SetStateAction<boolean>>
  }
}

export interface AuthenticationDialogProviderProps {
  children: React.ReactNode
}
