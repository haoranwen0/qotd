import { Dispatch, SetStateAction } from "react"

export type AuthenticationFormType = "signIn" | "signUp"

export interface AuthenticationForm {
  email: string
  password: string
}

export interface AuthenticationDialogProps {
  formType: AuthenticationFormType
}

export interface UseAuthenticationDialogParams {
  formType: AuthenticationFormType
}

export const AUTH_FORM_CONTENT = {
  signIn: {
    title: "Welcome Back",
    description: "Enter your credentials to access your account.",
    button: "Sign In",
    redirect: "Don't have an account?",
    redirectButton: "Sign up"
  },
  signUp: {
    title: "Create an Account",
    description: "Fill out the form below to get started.",
    button: "Create Account",
    redirect: "Already have an account?",
    redirectButton: "Sign in"
  }
} as const

export type UpdateForm = (e: React.ChangeEvent<HTMLInputElement>) => void

export type SubmitForm = () => Promise<void>

export interface UseAuthenticationDialogResult {
  texts: {
    title: string
    description: string
    button: string
    redirect: string
    redirectButton: string
  }
  formType: {
    value: AuthenticationFormType
    update: Dispatch<SetStateAction<AuthenticationFormType>>
    redirect: () => void
  }
  form: {
    value: AuthenticationForm
    update: UpdateForm
    submit: SubmitForm
  }
}

export type UseAuthenticationDialog = () => UseAuthenticationDialogResult
