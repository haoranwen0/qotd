// src/contexts/AuthContext.tsx

import React, { createContext, useContext } from "react"
import { useAuth } from "../../hooks"
import { AuthContextType, AuthProviderProps } from "./types"

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const { children } = props

  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  return useContext(AuthContext)
}
