"use client"

import { memo } from "react"

import { chakra, useRecipe } from "@chakra-ui/react"
import AutoResize from "react-textarea-autosize"
import { QuestionInputProps } from "./types"

const StyledAutoResize = chakra(AutoResize)

const QuestionInput: React.FC<QuestionInputProps> = (props) => {
  const recipe = useRecipe({ key: "textarea" })
  const styles = recipe({ size: "sm" })

  return (
    <StyledAutoResize
      placeholder="Type your answer"
      _placeholder={{
        color: "muted"
      }}
      value={props.response}
      onChange={props.updateResponse}
      name="response"
      autoFocus
      color="text"
      fontSize="body.primary"
      outline="none"
      border="none"
      padding="1rem 0"
      lineHeight="1.5"
      minH="initial"
      resize="none"
      overflow="hidden"
      css={styles}
      disabled={props.disabled}
    />
  )
}

export default memo(QuestionInput)
