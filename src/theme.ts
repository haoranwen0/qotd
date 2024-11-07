import {
  createSystem,
  defineConfig,
  defaultConfig,
  mergeConfigs
} from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        background: {
          value: {
            base: "#F6F4F1", // Soft white with slight purple undertone
            _dark: "#385245" // Deep blue-black
          }
        },
        primary: {
          value: {
            base: "#385245",
            _dark: "#F6F4F1"
          }
        },
        text: {
          value: {
            base: "#2A3E35", // Deep blue-grey
            _dark: "#F6F4F1" // Light purple-white
          }
        },
        accent: {
          value: {
            base: "#eb8787", // Soft purple
            _dark: "#eb8787" // Bright purple
          }
        },
        secondary: {
          value: {
            base: "#EBE8E5", // Light purple-white
            _dark: "#2D4238" // Lighter background for cards
          }
        },
        muted: {
          value: {
            base: "#9A958F",
            _dark: "#B5B0AA"
          }
        }
      }
    },
    tokens: {
      fonts: {
        heading: { value: "'Roslindale Display'" },
        body: {
          value:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }
      },
      fontSizes: {
        heading: {
          xl: { value: "2.25rem" },
          lg: { value: "1.875rem" },
          md: { value: "1.5rem" },
          sm: { value: "1rem" }
        },
        body: {
          primary: { value: "1.125rem" },
          secondary: { value: "1rem" }
        }
      },
      spacing: {
        sm: { value: "1rem" },
        md: { value: "1.5rem" },
        lg: { value: "2rem" }
      }
    }
  },
  globalCss: {
    "html, body": {
      fontFamily: "'Source Serif Pro', serif !important"
    }
  }
})

export const system = createSystem(mergeConfigs(defaultConfig, customConfig))
