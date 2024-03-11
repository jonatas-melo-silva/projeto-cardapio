/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        home: "#F6F7F8",
        footer: "#FF3131"
      },
      backgroundImage: {
        header: "url('/assets/bg.png')",
      },
    },
  },
  plugins: [],
};
