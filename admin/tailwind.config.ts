import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyhook: {
          black: "#0a0a0a",
          amber: "#f59e0b",
          orange: "#ea580c",
        },
      },
    },
  },
  plugins: [],
} satisfies Config
