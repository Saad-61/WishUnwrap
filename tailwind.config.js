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
          secondary: '#C44569',
          accent: '#5F27CD',
          bg: '#FFB8B8',
        },
      },
      fontFamily: {
        'display': ['"Outfit"', 'sans-serif'],
        'body': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
