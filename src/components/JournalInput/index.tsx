"use client"

import { chakra, useRecipe } from "@chakra-ui/react"
import AutoResize from "react-textarea-autosize"

import { JournalInputProps } from "./types"

const StyledAutoResize = chakra(AutoResize)

const JournalInput: React.FC<JournalInputProps> = (props) => {
  const recipe = useRecipe({ key: "textarea" })
  const styles = recipe({ size: "sm" })

  return (
    <StyledAutoResize
      placeholder="Continue to journal your thoughts here..."
      _placeholder={{
        color: "muted"
      }}
      value={props.thought.value.current}
      onChange={(e) => {
        // Update the thought -> this will trigger the debounce to auto save
        props.thought.update((prevState) => ({
          ...prevState,
          current: e.target.value
        }))
        // Update the cached thought -> in case the user is not authenticated
        props.cachedThought.update(e.target.value)
      }}
      lineHeight="1.5"
      name="response"
      autoFocus
      color="text"
      fontSize="body.primary"
      outline="none"
      border="none"
      padding="1rem 0"
      minH="initial"
      resize="none"
      overflow="hidden"
      css={styles}
    />
  )
}

export default JournalInput
