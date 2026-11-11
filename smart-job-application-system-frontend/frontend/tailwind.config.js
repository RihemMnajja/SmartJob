/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#b9d1ff',
          300: '#8bb2ff',
          400: '#5c8dff',
          500: '#2f63f6',
          600: '#1f47d6',
          700: '#1836ab',
          800: '#152c86',
          900: '#13276b',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d7dbe3',
          300: '#b3bac9',
          400: '#8891a6',
          500: '#666f88',
          600: '#4f576e',
          700: '#3b4157',
          800: '#262b3d',
          900: '#161a29',
        },
        accent: {
          DEFAULT: '#12b1a6',
          light: '#e3faf7',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(22, 26, 41, 0.08)',
        card: '0 2px 12px -2px rgba(22, 26, 41, 0.06)',
        lift: '0 12px 32px -8px rgba(47, 99, 246, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
