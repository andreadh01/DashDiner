/** @type {import('tailwindcss').Config} */
const colors = require("material-ui-colors");

module.exports = {
  important: true,
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: { ...colors },
    },
  },
  plugins: [],
};
