/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        purple: {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        dark: {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f0f23',
          400: '#0a0a1a',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'gradient-cyan': 'linear-gradient(135deg, #00d4ff, #0099cc)',
        'gradient-teal': 'linear-gradient(135deg, #1dd1a1, #55efc4)',
        'gradient-pink': 'linear-gradient(135deg, #ff6b9d, #fd79a8)',
        'card-gradient': 'linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(0, 212, 255, 0.1))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(155, 89, 182, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(155, 89, 182, 0.4)' },
        },
      }
    },
  },
  plugins: [],
}