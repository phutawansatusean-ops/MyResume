/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#080B10',
          card: '#111720',
          border: '#202936',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9CA6B5',
        },
        accent: {
          DEFAULT: '#5B8DEF',
          soft: '#3A4A63',
          muted: '#2A3444',
        },
        light: {
          bg: '#F7F8FA',
          card: '#FFFFFF',
          border: '#E4E8EE',
          primary: '#12161C',
          secondary: '#5D6773',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.24), 0 8px 24px -12px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
