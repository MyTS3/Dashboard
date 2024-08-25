/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        mainbg_400: "rgba(37, 41, 67, 1)",
        mainbg_500: "rgba(37, 40, 65, 1)",
        mainbg_600: "rgba(20, 25, 49, 1)",
        main_red: "rgba(255, 69, 58, 1)",
        main_orange: "rgba(255, 158, 11, 1)",
        main_green: "rgba(50, 215, 75, 1)",
      },
    },
  },
  plugins: [],
};
