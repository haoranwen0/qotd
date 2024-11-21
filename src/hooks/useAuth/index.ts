// src/hooks/useAuth.ts

import { useState, useEffect } from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, loading }
}
