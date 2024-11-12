import React from "react"

import {
  Button,
  Fieldset,
  Input,
  Box,
  IconButton,
  Text,
  HStack
} from "@chakra-ui/react"
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
    <Box pos="absolute" top="sm" right="sm">
      <DialogRoot placement="center" motionPreset="slide-in-bottom" size="sm">
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
                <Field label="Email">
                  <Input
                    value={authenticationDialog.form.value.email}
                    onChange={authenticationDialog.form.update}
                    name="email"
                    type="email"
                    variant="subtle"
                    border="none"
                    bgColor="secondary"
                    outline="none"
                  />
                </Field>
                <Field label="Password">
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
                <HStack
                  fontSize="sm"
                  color="muted"
                  mt={2}
                  mb={4}
                  justifyContent="space-between"
                >
                  <Text>{authenticationDialog.texts.redirect}</Text>
                  <Button
                    variant="plain"
                    color="accent"
                    fontSize="sm"
                    onClick={() => authenticationDialog.formType.redirect()}
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
    </Box>
  )
}

export default AuthenticationDialog
