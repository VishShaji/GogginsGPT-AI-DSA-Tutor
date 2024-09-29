/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'copy-default': '#D1D5DB',
        'copy-success': '#10B981',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionProperty: {
        'opacity': 'opacity',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['group-hover'],
    },
  },
  plugins: [],
}