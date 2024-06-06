/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1a1a2e',
          lighter: '#16213e',
          accent: '#e94560',
          gray: '#7e8182',
        },
        purple: {
          DEFAULT: '#5a189a',
          light: '#be88ef',
          dark: '#3c096c',
        },
      },
    },
  },
  plugins: [],
}

