/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        'yekan-bakh': ['yekan-bakh', 'Arial', 'sans-serif'],
      },
      colors: {
        mainbg_300: 'rgba(56, 61, 99, 1)',
        mainbg_400: 'rgba(37, 41, 67, 1)',
        mainbg_500: 'rgba(37, 40, 65, 1)',
        mainbg_600: 'rgba(20, 25, 49, 1)',
        main_red: 'rgb(201,11,14)',
        main_orange: 'rgb(236,102,0)',
        main_green: 'rgba(50, 215, 75, 1)',
        main_blue: 'rgba(1, 107, 255, 1)',
        bermudaGray: 'rgba(108, 135, 168, 1)',
      },
      gap: {
        layout: '15px',
        btn: '5px',
      },
    },
  },
  plugins: [],
};
