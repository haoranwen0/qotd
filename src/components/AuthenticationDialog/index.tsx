import React from "react"

import { Button, Fieldset, Input, IconButton, HStack } from "@chakra-ui/react"
import { MdPerson } from "react-icons/md"

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "../ui/dialog"
import { Field } from "../ui/field"
import useAuthenticationDialog from "./hook"

const AuthenticationDialog: React.FC = () => {
  const authenticationDialog = useAuthenticationDialog()

  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      size="sm"
      onExitComplete={() => authenticationDialog.form.reset(true)}
    >
      <DialogTrigger asChild>
        <IconButton
          aria-label="Profile"
          _hover={{ bgColor: "bg-hover" }}
          bgColor="transparent"
          outline="none"
          size="sm"
          variant="ghost"
          mb="xs"
        >
          <MdPerson />
        </IconButton>
      </DialogTrigger>
      <DialogContent boxShadow="none" bgColor="background">
        <DialogHeader>
          <DialogTitle>{authenticationDialog.texts.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription mb={4}>
            {authenticationDialog.texts.description}
          </DialogDescription>

          <Fieldset.Root size="sm" maxW="md">
            <Fieldset.Content>
              <Field
                label="Email"
                invalid={!!authenticationDialog.form.errors.email}
                errorText={authenticationDialog.form.errors.email}
              >
                <Input
                  value={authenticationDialog.form.value.email}
                  onChange={authenticationDialog.form.update}
                  name="email"
                  type="email"
                  variant="subtle"
                  border="none"
                  bgColor="secondary"
                  outline="none"
                  autoComplete="email"
                />
              </Field>
              {authenticationDialog.show.passwordField && (
                <Field
                  label="Password"
                  invalid={!!authenticationDialog.form.errors.password}
                  errorText={authenticationDialog.form.errors.password}
                >
                  <Input
                    value={authenticationDialog.form.value.password}
                    onChange={authenticationDialog.form.update}
                    name="password"
                    type="password"
                    variant="subtle"
                    border="none"
                    bgColor="secondary"
                    outline="none"
                  />
                </Field>
              )}
              <HStack
                fontSize="sm"
                color="muted"
                justifyContent={
                  authenticationDialog.show.forgetPasswordRedirect
                    ? "space-between"
                    : "flex-end"
                }
              >
                {authenticationDialog.show.forgetPasswordRedirect && (
                  <Button
                    variant="plain"
                    fontSize="sm"
                    color="muted"
                    px={0}
                    _hover={{ color: "accent" }}
                    onClick={() => {
                      authenticationDialog.formType.update("forgetPassword")
                      authenticationDialog.form.reset()
                    }}
                  >
                    Forgot password?
                  </Button>
                )}
                <Button
                  variant="plain"
                  color="muted"
                  fontSize="sm"
                  px={0}
                  onClick={() => authenticationDialog.formType.redirect()}
                  _hover={{ color: "accent" }}
                >
                  {authenticationDialog.texts.redirectButton}
                </Button>
              </HStack>
            </Fieldset.Content>

            <Button
              type="submit"
              variant="subtle"
              alignSelf="flex-start"
              onClick={() => authenticationDialog.form.submit()}
            >
              {authenticationDialog.texts.button}
            </Button>
          </Fieldset.Root>
        </DialogBody>
        <DialogCloseTrigger _hover={{ bgColor: "bg-hover" }} />
      </DialogContent>
    </DialogRoot>
  )
}

export default AuthenticationDialog
