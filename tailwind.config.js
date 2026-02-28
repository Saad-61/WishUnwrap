/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibrant: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          bg: '#667eea',
        },
        dreamy: {
          primary: '#FFB7C5',
          secondary: '#C3B1E1',
          accent: '#F8E9A1',
          bg: '#E8F4F8',
        },
        starry: {
          primary: '#FFD700',
          secondary: '#4A5568',
          accent: '#F7FAFC',
          bg: '#1A202C',
        },
        retro: {
          primary: '#FF6B9D',
          secondary: '#E8557A',
          accent: '#FFD93D',
          bg: '#FFF0F3',
          text: '#2D1B33',
        },
      },
      fontFamily: {
        'display': ['"Outfit"', 'sans-serif'],
        'body': ['"Inter"', 'sans-serif'],
        'handwriting': ['"Pacifico"', 'cursive'],
        'handwriting-alt': ['"Caveat"', 'cursive'],
        'marker': ['"Permanent Marker"', 'cursive'],
      },
      animation: {
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'flicker': 'flicker 0.8s ease-in-out infinite',
        'float-up': 'float-up 1.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'confetti': 'confetti-fall 3s ease-in-out forwards',
        'smoke': 'smoke-rise 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
