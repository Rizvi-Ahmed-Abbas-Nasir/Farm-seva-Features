/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'gradient-main': 'linear-gradient(90deg, #4f46e5, #3b82f6)', // example gradient
      },
    },
  },
  plugins: [],
}
