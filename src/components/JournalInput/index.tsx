"use client"

import { chakra, useRecipe } from "@chakra-ui/react"
import AutoResize from "react-textarea-autosize"

import { JournalInputProps } from "./types"

const StyledAutoResize = chakra(AutoResize)

const QuestionInput: React.FC<JournalInputProps> = (props) => {
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
        props.thought.update((prevState) => ({
          ...prevState,
          current: e.target.value
        }))
      }}
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

export default QuestionInput
