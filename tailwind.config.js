/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      width: {
        1024: '1024px',
      },
    },
  },
  plugins: [],
}
