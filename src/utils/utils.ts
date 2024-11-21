type Color = {
  name: string
  // Optional hex code for potential future use
  hex?: string
}

type Animal = {
  name: string
  // Optional category for potential filtering
  category?: "mammal" | "bird" | "reptile" | "fish"
}

// Define our collections
const colors: Color[] = [
  { name: "red", hex: "#FF0000" },
  { name: "blue", hex: "#0000FF" },
  { name: "green", hex: "#00FF00" },
  { name: "purple", hex: "#800080" },
  { name: "golden", hex: "#FFD700" },
  { name: "silver", hex: "#C0C0C0" },
  { name: "cosmic", hex: "#2E2D4D" }
]

const animals: Animal[] = [
  { name: "panda", category: "mammal" },
  { name: "tiger", category: "mammal" },
  { name: "eagle", category: "bird" },
  { name: "dolphin", category: "mammal" },
  { name: "dragon", category: "reptile" },
  { name: "phoenix", category: "bird" },
  { name: "wolf", category: "mammal" }
]

interface UsernameOptions {
  /** Minimum number to use in generation */
  minNumber?: number
  /** Maximum number to use in generation */
  maxNumber?: number
  /** Whether to capitalize the first letter of each word */
  capitalize?: boolean
  /** Character to use as separator between words */
  separator?: string
}

/**
 * Generates a random username combining a color, animal, and number
 * @param options Configuration options for username generation
 * @returns A randomly generated username
 */
function generateUsername(options: UsernameOptions = {}): string {
  const {
    minNumber = 1,
    maxNumber = 999,
    capitalize = true,
    separator = ""
  } = options

  // Get random elements
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  const randomNumber =
    Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber

  // Format words based on capitalization preference
  const formatWord = (word: string) => {
    return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word
  }

  // Combine elements
  const username = [
    formatWord(randomColor.name),
    formatWord(randomAnimal.name),
    randomNumber.toString()
  ].join(separator)

  return username
}

/**
 * Creates a promise that resolves after a specified delay.
 * @param ms The delay time in milliseconds.
 * @returns A promise that resolves after the specified delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Export for use in other modules
export {
  delay,
  generateUsername,
  type UsernameOptions,
  type Color,
  type Animal
}
