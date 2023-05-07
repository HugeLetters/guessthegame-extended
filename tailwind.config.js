/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{ts,tsx,js,jsx,html}",
    "./contents/**/*.{ts,tsx,js,tsx}",
    "./source/**/*.{ts,tsx,js,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        win: "rgb(7 125 92)",
        fail: "rgb(152 27 31)",
      },
    },
  },
  plugins: [],
  important: true,
  corePlugins: { preflight: false },
};
