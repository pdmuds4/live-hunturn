import type { Config } from "tailwindcss";

export default {
  important: true,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
