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
        'custom-light-blue': '#CBE0F9',
        'custom-cyan1': 'rgb(59, 130, 246 / 0.5)'
      },
    },
  },
  plugins: [],
}