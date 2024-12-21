import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError,
  updateProfile,
  User,
  sendEmailVerification,
  signOut
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
import useJournal from "../../hooks/useJournal"

const useAuthenticationDialog: UseAuthenticationDialog = () => {
  const { promptToSave } = useAuthenticationDialogContext()
  // const { isOpen, promptToSave } = useAuthenticationDialogContext()
  const { handleJournalSubmission } = useJournal()

  const [formType, setFormType] = useState<AuthenticationFormType>("signIn")
  const [errorMessages, setErrorMessages] = useState<AuthenticationForm>({
    email: "",
    password: ""
  })
  const [form, setForm] = useState<AuthenticationForm>({
    email: "",
    password: ""
  })

  // Set form type to signUp if promptToSave is true. This happens after user tries to submit and they're not already signed in.
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

  /**
   * Sends an email verification to the user and handles the UI feedback.
   *
   * @param user - The User object to send verification email to
   *
   * This function:
   * 1. Sends a verification email to the user
   * 2. Displays a success toast with context-specific message
   * 3. Signs out the user
   * 4. Handles errors by displaying an error toast
   */
  const sendEmailVerificationHelper = useCallback(
    async (user: User) => {
      try {
        await sendEmailVerification(user)

        const titleMap: Record<AuthenticationFormType, string> = {
          signIn: "It looks like you're not verified yet",
          signUp: "Signed up successfully",
          forgetPassword: ""
        }

        toaster.create({
          title: titleMap[formType],
          description:
            "A verification email has been sent to your inbox. Please verify your email before signing in again.",
          type: "success",
          duration: 5000
        })

        await signOut(auth)
      } catch (error) {
        const { code } = error as AuthError
        toaster.create({
          title: "Error sending email verification",
          description: code,
          type: "error",
          duration: 3500
        })
      }
    },
    [auth, formType]
  )

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

    let userObject: User | null = null

    // Submit form
    try {
      switch (formType) {
        case "signIn":
          let signInResult = await signInWithEmailAndPassword(
            auth,
            email,
            password
          )
          userObject = signInResult.user

          // If user is not verified, send them a verification email
          if (!userObject.emailVerified) {
            await sendEmailVerificationHelper(userObject)
            return
          }

          toaster.create({
            title: "Signed in successfully.",
            type: "success",
            duration: 3500
          })
          break
        case "signUp":
          // Sign up user
          let signUpResult = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          )
          userObject = signUpResult.user

          // Update user profile with a random username
          await updateProfile(signUpResult.user, {
            displayName: generateUsername()
          })

          await sendEmailVerificationHelper(userObject)

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

      // If user is signing in and they are a verified user
      if (
        formType === "signIn" &&
        userObject !== null &&
        userObject.emailVerified
      ) {
        await handleJournalSubmission(userObject, "qotd")
        await handleJournalSubmission(userObject, "thought")
      }
    } catch (error) {
      const firebaseError = error as AuthError
      toaster.create({
        title: "An error has occurred.",
        description: firebaseError.code,
        type: "error",
        duration: 3500
      })
    } finally {
      // resetForm()
      // isOpen.update(false)
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
