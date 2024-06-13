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
        dark_white: "f8f9fb",
        grey: "#e2e2e2",
        accent: "#14b8a6",
        dark_accent: "#0f766e",
      },
      screens: {
        xs: "374px",
        "desktop": "880px"
      },
    },
  },
  plugins: [],
}

