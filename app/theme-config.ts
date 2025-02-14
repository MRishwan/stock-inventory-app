import type { Config } from "tailwindcss"

export const themeConfig = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006B3E", // Dark green from logo
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7AB800", // Light green from logo
          foreground: "#FFFFFF",
        },
      },
    },
  },
} satisfies Config["theme"]

