import React from "react"

import { Box } from "@chakra-ui/react"

import { useAuthContext } from "../../contexts"
import AuthenticationDialog from "../AuthenticationDialog"
import UserMenu from "../UserMenu"

const AuthenticationControl: React.FC = () => {
  const { user } = useAuthContext()

  const validUser = user !== null && user.emailVerified

  return (
    <Box pos="absolute" top="sm" right="sm">
      {validUser ? <UserMenu /> : <AuthenticationDialog />}
    </Box>
  )
}

export default AuthenticationControl
