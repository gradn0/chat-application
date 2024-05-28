/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        off_white: "#f5f5f5",
        accent: "#14b8a6",
        dark_accent: "#0f766e",
      }
    },
  },
  plugins: [],
}

