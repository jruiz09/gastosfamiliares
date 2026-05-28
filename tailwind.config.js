/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {

    extend: {

      colors: {

        primary: '#db2777',
        secondary: '#f9a8d4',
        dark: '#fff0f6',
        card: '#ffffff',

      },

      boxShadow: {

        pink: '0 20px 50px rgba(219,39,119,0.18)',

      },

    },

  },

  plugins: [],

}