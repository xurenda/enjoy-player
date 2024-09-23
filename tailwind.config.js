/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'color-primary': 'rgb(var(--color-primary-arr) / <alpha-value>)',
        'color-bg': 'var(--color-bg)',
        'color-bg-gray': 'var(--color-bg-gray)',
        'color-hover': 'var(--color-hover)',
        'color-border': 'var(--color-border)',
        'color-disable': 'var(--color-disable)',
        'color-gray': 'var(--color-gray)',
      },
      transitionDuration: {
        normal: '300ms',
      },
    },
  },
  plugins: [],
}
