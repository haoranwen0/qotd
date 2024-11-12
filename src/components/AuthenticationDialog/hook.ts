import { useCallback, useMemo, useState } from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from "firebase/auth"

import { auth } from "../../main"
import {
  AuthenticationFormType,
  AUTH_FORM_CONTENT,
  UseAuthenticationDialog,
  AuthenticationForm,
  UpdateForm,
  SubmitForm
} from "./types"
import { toaster } from "../ui/toaster"

const useAuthenticationDialog: UseAuthenticationDialog = () => {
  const [formType, setFormType] = useState<AuthenticationFormType>("signIn")
  const [form, setForm] = useState<AuthenticationForm>({
    email: "",
    password: ""
  })

  const texts = useMemo(() => AUTH_FORM_CONTENT[formType], [formType])

  const updateForm: UpdateForm = useCallback((e) => {
    const { name, value } = e.target
    setForm((prevState) => ({ ...prevState, [name]: value }))
  }, [])

  const redirectFormType = useCallback(() => {
    setFormType(formType === "signIn" ? "signUp" : "signIn")
  }, [formType])

  const handleSubmit: SubmitForm = useCallback(async () => {
    const { email, password } = form

    if (!email || !password) return

    try {
      switch (formType) {
        case "signIn":
          await signInWithEmailAndPassword(auth, email, password)
          break
        case "signUp":
          await createUserWithEmailAndPassword(auth, email, password)
          break
        default:
          break
      }
    } catch (error) {
      const firebaseError = error as AuthError
      toaster.create({
        title: "An error has occurred.",
        description: firebaseError.message,
        type: "error",
        duration: 3500
      })
    }
  }, [formType, form])

  return {
    texts,
    formType: {
      value: formType,
      update: setFormType,
      redirect: redirectFormType
    },
    form: {
      value: form,
      update: updateForm,
      submit: handleSubmit
    }
  }
}

export default useAuthenticationDialog
