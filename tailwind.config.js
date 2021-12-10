module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minHeight: {
    	'30vh': '30vh'
    },
    minWidth: {
    	'40vw': '40vw'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
  	require('@tailwindcss/forms')
  ],
}
