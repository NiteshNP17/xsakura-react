/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Define your color palette for light mode
        light: {
          primary: "#3490dc",
          secondary: "#ffed4a",
          // ...
        },
        // Define your color palette for dark mode
        dark: {
          primary: "#6366f1",
          secondary: "#a3e635",
          // ...
        },
      },
    },
  },
  darkMode: "selector", // or 'media' (default)
  plugins: [],
};
