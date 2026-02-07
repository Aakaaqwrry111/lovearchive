/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B0F1A",
        crimson: "#FF2E63",
        cyan: "#08D9D6"
      },
      boxShadow: {
        glow: "0 0 25px rgba(255, 46, 99, 0.35)",
        cyan: "0 0 25px rgba(8, 217, 214, 0.35)"
      }
    }
  },
  plugins: []
};
