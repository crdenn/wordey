/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          '0%, 50%': { opacity: 1 },
          '100%': { opacity: 0 }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        },
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(180deg)' }
        }
      },
      animation: {
        'fade-out': 'fadeOut 2.1s ease-out',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        flip: 'flip 0.6s ease-in-out'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
