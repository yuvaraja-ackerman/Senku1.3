/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        darkCard: "#131B2E",
        darkBorder: "#1E293B",
        cyberCyan: "#00F2FE",
        cyberBlue: "#4FACFE",
        cyberRed: "#FF2E93",
        cyberYellow: "#FFC857"
      }
    },
  },
  plugins: [],
}
