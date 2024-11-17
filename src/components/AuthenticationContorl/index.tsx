import React from "react"

import { Box } from "@chakra-ui/react"

import { useAuthContext } from "../../contexts"
import AuthenticationDialog from "../AuthenticationDialog"
import UserMenu from "../UserMenu"

const AuthenticationControl: React.FC = () => {
  const { user } = useAuthContext()

  return (
    <Box pos="absolute" top="sm" right="sm">
      {user ? <UserMenu /> : <AuthenticationDialog />}
    </Box>
  )
}

export default AuthenticationControl
