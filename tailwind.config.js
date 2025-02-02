/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mintwhite: '#f8f9fa',
        darkblack: '#212529',
        darkgrey: '#343a40',
        newgrey: '#bebebe',
        dirtywhite: '#e9ecef',
        dark: '#1e1e1e',
        lightgrey: '#343a40',
        black: '#000000',
        lightblue: '#bde0fe',
        darkblue: '#023047',
        white: '#ffffff',
        green: '#606c38',
        red: '#b90504',
        yellow: '#ffc300',
        blue: '#0077b6',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0077b6',  
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#343a40',  
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system', 
          'sans-serif'
        ],
        heading: [
          'Poppins',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Plus Jakarta Sans', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system', 
          'sans-serif'
        ],
      },
      fontSize: {
        'default': '1rem',
        'small': '0.8rem',
        'medium': '1.2rem',
        'h5': '1.3rem',
        'medium-large': '1.4rem',
        'large': '1.6rem',
        'x-large': '2rem',
        'h2': '2.188rem',
        'xx-large': '2.4rem',
        'big': '2.813rem',
      },
      fontWeight: {
        'very-light': '100',
        'mid-light': '200',
        'light': '300',
        'normal': '400',
        'mid-normal': '500',
        'strong': '600',
        'bold': '700',
        'very-bold': '800',
        'super-bold': '900',
      },
      boxShadow: {
        'form': '0.3rem 0.3rem 0.4rem rgba(20, 23, 25, 0.25)',
        'btn': '5px 5px 7px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'form': '0.3rem',
        'textarea': '0.3rem 0.3rem 1.2rem 0.3rem',
        'btn': '3px',
      },
      padding: {
        'btn-default': '10px 20px',
        'btn-large': '15px 30px',
        'btn-vlarge': '20px 45px',
      },
      spacing: {
        '0.6': '0.6rem',
        '1.8': '1.8rem',
      },
      height: {
        '1.8': '1.8rem',
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      animationDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
