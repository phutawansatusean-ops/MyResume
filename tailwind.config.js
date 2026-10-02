/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0B100F',
          card: '#111A18',
          border: '#263633',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9CA6B5',
        },
        accent: {
          DEFAULT: '#43C6A2',
          soft: '#244B41',
          muted: '#1D3932',
        },
        light: {
          bg: '#F3F6F2',
          card: '#FFFFFF',
          border: '#DDE6E0',
          primary: '#15211D',
          secondary: '#5B6B64',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans Thai', 'sans-serif'],
        display: ['Space Grotesk', 'Noto Sans Thai', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.24), 0 8px 24px -12px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
