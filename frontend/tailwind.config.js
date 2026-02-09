/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Education-friendly pastels
        pastel: {
          pink: '#FFE4E8',
          yellow: '#FFF9E6',
          blue: '#E6F3FF',
          purple: '#F3E6FF',
          green: '#E6FFF0',
        },
        accent: {
          pink: '#FF6B8A',
          yellow: '#FFB84D',
          blue: '#4D9FFF',
          purple: '#9B6BFF',
        },
      },
    },
  },
  plugins: [],
}
