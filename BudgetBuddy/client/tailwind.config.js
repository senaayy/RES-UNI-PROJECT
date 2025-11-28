export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#d5392a',
        secondary: '#6e7791',
        'background-dark': '#121828'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.37)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

