/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,js,tsx}", "./dist/index.html"],
  theme: {
    extend: {
      colors: {
        win: "rgb(7 125 92)",
        fail: "rgb(152 27 31)",
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
  important: true,
};
