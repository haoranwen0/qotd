import React, { createContext, useState } from "react"

import {
  AuthenticationDialogContextType,
  AuthenticationDialogProviderProps
} from "./types"

const AuthenticationDialogContext =
  createContext<AuthenticationDialogContextType>({
    isOpen: {
      value: false,
      update: () => {}
    },
    promptToSave: {
      value: false,
      update: () => {}
    }
  })

export const AuthenticationDialogProvider: React.FC<
  AuthenticationDialogProviderProps
> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [promptToSave, setPromptToSave] = useState(false)

  const value = {
    isOpen: {
      value: isOpen,
      update: setIsOpen
    },
    promptToSave: {
      value: promptToSave,
      update: setPromptToSave
    }
  }

  return (
    <AuthenticationDialogContext.Provider value={value}>
      {props.children}
    </AuthenticationDialogContext.Provider>
  )
}

export const useAuthenticationDialogContext = () => {
  return React.useContext(AuthenticationDialogContext)
}
