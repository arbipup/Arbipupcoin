/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arbiblue: "#2D9CDB",
      },
      keyframes: {
        "color-cycle": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "25%": { filter: "hue-rotate(90deg)" },
          "50%": { filter: "hue-rotate(180deg)" },
          "75%": { filter: "hue-rotate(270deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "color-cycle": "color-cycle 10s infinite linear",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
