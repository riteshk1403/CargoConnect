/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bbdffd',
          300: '#7cc2fc',
          400: '#36a2fa',
          500: '#0c87eb',
          600: '#0069c7',
          700: '#0054a3',
          800: '#054885',
          900: '#0a3c6d',
          950: '#072648',
        }
      }
    },
  },
  plugins: [],
}
