import React from "react"

import { signOut } from "firebase/auth"

import { MenuItem, MenuContent, MenuTrigger, Text } from "@chakra-ui/react"
import { MdLogout } from "react-icons/md"

import { useAuthContext } from "../../contexts"
import { Avatar } from "../ui/avatar"
import { MenuRoot } from "../ui/menu"
import { auth } from "../../main"
import useJournal from "../../hooks/useJournal"

const UserMenu: React.FC = () => {
  const { user } = useAuthContext()
  const { setCachedThought, setCachedQOTD } = useJournal()

  return (
    <MenuRoot variant="subtle">
      <MenuTrigger asChild>
        <Avatar
          size="sm"
          variant="subtle"
          name={user?.email ?? ""}
          cursor="pointer"
        />
      </MenuTrigger>
      <MenuContent pos="absolute" top="100%" right="0" mt="xs" boxShadow="none">
        <MenuItem
          value="logout"
          onClick={async () => {
            setCachedThought("")
            setCachedQOTD((prevState) => ({
              ...prevState,
              response: "",
              answer_id: ""
            }))
            await signOut(auth)
          }}
          cursor="pointer"
        >
          <MdLogout />
          <Text>Logout</Text>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}

export default UserMenu
