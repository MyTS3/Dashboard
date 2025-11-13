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
        mainbg_300: 'rgb(var(--mainbg_300) / <alpha-value>)',
        mainbg_400: 'rgb(var(--mainbg_400) / <alpha-value>)',
        mainbg_500: 'rgb(var(--mainbg_500) / <alpha-value>)',
        mainbg_600: 'rgb(var(--mainbg_600) / <alpha-value>)',
        main_red: 'rgb(var(--main_red) / <alpha-value>)',
        main_orange: 'rgb(var(--main_orange) / <alpha-value>)',
        main_green: 'rgb(var(--main_green) / <alpha-value>)',
        main_blue: 'rgb(var(--main_blue) / <alpha-value>)',
        bermudaGray: 'rgb(var(--bermudaGray) / <alpha-value>)',
      },
      gap: {
        layout: '15px',
        btn: '5px',
      },
    },
  },
  plugins: [],
};
