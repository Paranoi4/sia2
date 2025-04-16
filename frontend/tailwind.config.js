// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '30': '7.5rem',
      },
      colors: {
        primary: "#000000",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },

      // ✅ Animations
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
        marquee: "marquee 40s linear infinite", // for smooth carousel
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // half, since images are duplicated
        },
      },
    },
  },
  plugins: [require("daisyui")],
};