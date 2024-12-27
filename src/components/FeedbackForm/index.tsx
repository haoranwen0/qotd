import React, { FormEvent, useCallback, useRef, useState } from "react"

import {
  Box,
  Fieldset,
  Flex,
  HStack,
  IconButton,
  Input,
  VStack
} from "@chakra-ui/react"
import { Field } from "../ui/field"
import { MdFeedback } from "react-icons/md"
import { IoIosSend } from "react-icons/io"

import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Radio, RadioGroup } from "../ui/radio"
import type { FeedbackForm } from "./types"
import { toaster } from "../ui/toaster"
import { collectFeedback } from "../../utils/api/feedback"

const FeedbackForm: React.FC = () => {
  // Ref Declarations
  const buttonRef = useRef<HTMLButtonElement>(null)

  // State Declarations
  const [feedback, setFeedback] = useState<FeedbackForm>({
    experience: "",
    general: ""
  })
  const [formOpened, setFormOpened] = useState(false)

  const validFeedbackForm = useCallback(() => {
    if (feedback.experience === "" && feedback.general.trim() === "") {
      toaster.create({
        title: "Please rate your experience",
        description: "Please rate your experience with Journaly",
        type: "info",
        duration: 3500
      })

      return false
    }

    return true
  }, [feedback])

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (validFeedbackForm()) {
        // Call api to submit feedback
        const [error, _] = await collectFeedback(
          feedback.experience,
          feedback.general
        )

        if (error !== null) {
          toaster.create({
            title: "Error",
            description: error.message,
            type: "error",
            duration: 3500
          })

          return
        }

        toaster.create({
          title: "Thanks!",
          description:
            "Your feedback has been submitted. We appreciate your input!",
          type: "success",
          duration: 3500
        })

        setFormOpened(false)

        setFeedback({
          experience: "",
          general: ""
        })
      }
    },
    [validFeedbackForm]
  )

  return (
    <Box pos="absolute" bottom="lg" right="lg">
      <DialogRoot
        placement="center"
        size="sm"
        motionPreset="slide-in-bottom"
        lazyMount
        open={formOpened}
        onOpenChange={(openChangeDetails) => {
          setFormOpened(openChangeDetails.open)
        }}
      >
        <DialogTrigger
          asChild
          onClick={() => {
            buttonRef.current?.blur()
          }}
          zIndex={99}
        >
          <IconButton
            ref={buttonRef}
            aria-label="Feedback"
            bgColor="bg-hover"
            borderRadius="full"
            colorScheme="dark"
            outline="none"
            size="sm"
            variant="subtle"
            mb="xs"
          >
            <MdFeedback />
          </IconButton>
        </DialogTrigger>
        <DialogContent boxShadow="none" bgColor="background" m="md">
          <DialogHeader>
            <DialogTitle>Give Feedback!</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Flex as="form" flexDir="column" gap={4} onSubmit={onSubmit}>
              <Fieldset.Root>
                <Field label="How would you rate your overall experience with Journaly">
                  <RadioGroup
                    name="experience"
                    value={feedback.experience}
                    onValueChange={({ value }) => {
                      setFeedback((prev) => ({
                        ...prev,
                        experience: value
                      }))
                    }}
                    borderColor="secondary"
                    size="sm"
                  >
                    <VStack w="full" alignItems="flex-start">
                      {["Terrible", "Bad", "Okay", "Good", "Great"].map(
                        (rating) => (
                          <Radio key={rating} value={rating}>
                            {rating}
                          </Radio>
                        )
                      )}
                    </VStack>
                  </RadioGroup>
                </Field>
                <Field label="Do you have any additional feedback or suggestions for improvement?">
                  <Input
                    name="feedback"
                    value={feedback.general}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        general: e.target.value
                      }))
                    }
                  />
                </Field>
              </Fieldset.Root>
              <HStack w="full">
                <Button variant="subtle" type="submit">
                  Submit
                  <IoIosSend />
                </Button>
              </HStack>
            </Flex>
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </Box>
  )
}

export default FeedbackForm
