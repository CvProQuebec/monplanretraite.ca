import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B4C8C',
        secondary: '#E8F4F8',
        accent: '#FF6B35',
      }
    },
  },
  plugins: [],
} satisfies Config