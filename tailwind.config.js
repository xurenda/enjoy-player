/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'color-primary': 'var(--color-primary)',
        'color-bg': 'var(--color-bg)',
        'color-bg-gray': 'var(--color-bg-gray)',
        'color-hover': 'var(--color-hover)',
        'color-border': 'var(--color-border)',
        'color-disable': 'var(--color-disable)',
      },
      transitionDuration: {
        normal: '300ms',
      },
      width: {
        1024: '1024px',
      },
    },
  },
  plugins: [],
}
