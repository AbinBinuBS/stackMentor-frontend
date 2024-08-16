/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-cyan': '#CEF6F6',
        'custom-light-blue': '#CBE0F9'
      },
    },
  },
  plugins: [],
}