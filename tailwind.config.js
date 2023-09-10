/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "200px",
      sss: "321px",
      ss: "376px",
      sm: "640px",
      md: "769px",
      mmd: "1000px",
      lg: "1023px",
      xl: "1280px",
      xxl: '1536px',
    },
  },
  plugins: [],
};
