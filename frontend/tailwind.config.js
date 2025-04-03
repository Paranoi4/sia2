/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        '30': '7.5rem',
      colors: {
        primary: "#000000", // Set primary color to black
      },

      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
   },
  },
  plugins: [require("daisyui")],
}
