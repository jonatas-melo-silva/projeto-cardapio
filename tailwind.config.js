/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        base: "F6F7F8",
      },
      backgroundImage: {
        header: "url('/assets/bg.png')",
      },
    },
  },
  plugins: [],
};
