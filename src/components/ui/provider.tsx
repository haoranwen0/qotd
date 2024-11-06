import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"

import { system } from "../../theme"
import { ColorModeProvider } from "./color-mode"

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ColorModeProvider {...props} />
      </ThemeProvider>
    </ChakraProvider>
  )
}
