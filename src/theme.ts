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
            base: "#F8F7FF", // Soft white with slight purple undertone
            _dark: "#1A1B25" // Deep blue-black
          }
        },
        text: {
          value: {
            base: "#2D3047", // Deep blue-grey
            _dark: "#E6E4F6" // Light purple-white
          }
        },
        accent: {
          value: {
            base: "#7765E3", // Soft purple
            _dark: "#9D8FFF" // Bright purple
          }
        },
        secondary: {
          value: {
            base: "#E6E4F6", // Light purple-white
            _dark: "#2D2E3D" // Lighter background for cards
          }
        },
        muted: {
          value: {
            base: "#6B6B7B", // Muted text
            _dark: "#9998A8" // Muted text
          }
        }
      }
    },
    tokens: {
      fonts: {
        heading: { value: "Inter, sans-serif" }
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
        sm: { value: "1rem" }
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
