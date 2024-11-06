import {
  createSystem,
  defineConfig,
  defaultConfig,
  mergeConfigs
} from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: "#0FEE0F" },
        secondary: { value: "#EE0F0F" }
      },
      fonts: {
        body: { value: "system-ui, sans-serif" }
      },
      spacing: {
        sm: { value: "1rem" }
      }
    }
  }
})

export const system = createSystem(mergeConfigs(defaultConfig, customConfig))
