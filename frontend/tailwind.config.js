/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Common colour variables */
        'primary-dark': '#395B64', /* Mostly used for button background and container drop shadow */
        'primary-color': '#A5C9CA', /* Used for container border colouring and contrasting text elements */

        /* Colour variables for light mode (lm) */
        'lm-light-bg': '#E7F6F2', /* Main feed background and used for other transitions */
        'lm-custom-black': '#2C3333', /* used for any black text to give a softer look */

        /* Colour variables for dark mode (dm) */
        'dm-container-fill-bg': '#1F2937', /* Used for filling out background of any container elements on feed */
        'dm-dark-bg': '#111827', /* Main feed background and used for other transitions */
        'dm-input-fill-bg': '#374151' /* Used for any input fields to make them stand out from dark background */
      }
    },
  },
  plugins: [],
  darkMode:'class'
}

