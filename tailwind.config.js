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
        main: "#0f172a",
      },
      animation: { scroll: "scroll 5s linear infinite" },
      keyframes: {
        scroll: { "100%": { translate: "calc(-100% - 1rem) 0%" } },
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
};
