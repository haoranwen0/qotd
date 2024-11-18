import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError,
  updateProfile
} from "firebase/auth"

import { auth } from "../../main"
import {
  AuthenticationFormType,
  AUTH_FORM_CONTENT,
  UseAuthenticationDialog,
  AuthenticationForm,
  UpdateForm,
  SubmitForm,
  ResetForm
} from "./types"
import { toaster } from "../ui/toaster"
import { generateUsername } from "../../utils/utils"
import { useAuthenticationDialogContext } from "../../contexts/AuthenticationDialogContext"

const useAuthenticationDialog: UseAuthenticationDialog = () => {
  const { promptToSave } = useAuthenticationDialogContext()

  const [formType, setFormType] = useState<AuthenticationFormType>("signIn")
  const [errorMessages, setErrorMessages] = useState<AuthenticationForm>({
    email: "",
    password: ""
  })
  const [form, setForm] = useState<AuthenticationForm>({
    email: "",
    password: ""
  })

  useEffect(() => {
    if (promptToSave.value) {
      setFormType("signUp")
    }
  }, [promptToSave.value])

  const texts = useMemo(() => AUTH_FORM_CONTENT[formType], [formType])

  const updateForm: UpdateForm = useCallback((e) => {
    const { name, value } = e.target
    setForm((prevState) => ({ ...prevState, [name]: value }))
    setErrorMessages((prevState) => ({ ...prevState, [name]: "" }))
  }, [])

  const redirectFormType = useCallback(() => {
    setFormType(formType === "signIn" ? "signUp" : "signIn")
    resetForm()
  }, [formType])

  const handleSubmit: SubmitForm = useCallback(async () => {
    // Get form values
    const { email, password } = form

    // Form validation
    switch (formType) {
      case "signIn":
      case "signUp":
        if (!email) {
          setErrorMessages((prevState) => ({
            ...prevState,
            email: "Please enter email to continue."
          }))
          return
        }
        if (!password) {
          setErrorMessages((prevState) => ({
            ...prevState,
            password: "Please enter password to continue."
          }))
          return
        }
        break
      case "forgetPassword":
        if (!email) {
          setErrorMessages((prevState) => ({
            ...prevState,
            email: "Please enter email to continue."
          }))
          return
        }
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
          // Sign up user
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          )
          // Update user profile with a random username
          await updateProfile(user, { displayName: generateUsername() })
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
        description: firebaseError.code,
        type: "error",
        duration: 3500
      })
    }
  }, [formType, form])

  const resetForm: ResetForm = useCallback((resetFormType) => {
    if (resetFormType) setFormType("signIn")
    setForm({ email: "", password: "" })
    setErrorMessages({ email: "", password: "" })
  }, [])

  // Show components based on form type
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
      errors: errorMessages,
      update: updateForm,
      submit: handleSubmit,
      reset: resetForm
    },
    show: {
      forgetPasswordRedirect: showForgetPasswordRedirect,
      passwordField: showPasswordField
    }
  }
}

export default useAuthenticationDialog
