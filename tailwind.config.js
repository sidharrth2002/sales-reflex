/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      },
      colors: {
        "primary-1-light": "#03C988", // most light
        "primary-2-light": "#8ca4c4",
        "primary-3-light": "#1a428b",
        "primary-4-light": "#041b74", // most dark
        "primary-1-dark": "",
        "primary-2-dark": "",
        "primary-3-dark": "",
        "primary-4-dark": "",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
