import { useCallback, useMemo, useState } from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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
    // Get form values
    const { email, password } = form

    // Form validation
    switch (formType) {
      case "signIn":
      case "signUp":
        if (!email || !password) return
        break
      case "forgetPassword":
        if (!email) return
        break
    }

    // Submit form
    try {
      switch (formType) {
        case "signIn":
          await signInWithEmailAndPassword(auth, email, password)
          toaster.create({
            title: "Signed in successfully.",
            type: "success",
            duration: 3500
          })
          break
        case "signUp":
          await createUserWithEmailAndPassword(auth, email, password)
          toaster.create({
            title: "Signed up successfully.",
            type: "success",
            duration: 3500
          })
          break
        case "forgetPassword":
          await sendPasswordResetEmail(auth, email)
          toaster.create({
            title: "Password reset email sent.",
            type: "success",
            duration: 3500
          })
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

  const showForgetPasswordRedirect = useMemo(
    () => formType === "signIn",
    [formType]
  )

  const showPasswordField = useMemo(
    () => formType !== "forgetPassword",
    [formType]
  )

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
    },
    show: {
      forgetPasswordRedirect: showForgetPasswordRedirect,
      passwordField: showPasswordField
    }
  }
}

export default useAuthenticationDialog
