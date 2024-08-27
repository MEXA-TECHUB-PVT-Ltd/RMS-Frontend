/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "selector",
  safelist: [
    {
      pattern:
        /(bg|text|border)-(yellow|blue|green|red|purple|pink|gray|cyan|indigo|emerald|rose|violet|amber|lime|fuchsia|teal|azure|warmGray|trueGray|coolGray|blueGray|redGray|orangeGray|yellowGray|greenGray|tealGray)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["responsive", "hover", "focus", "focus-within"],
    },
    {
      pattern:
        /border-(yellow|blue|green|red|purple|pink|gray|cyan|indigo|emerald|rose|violet|amber|lime|fuchsia|teal|azure|warmGray|trueGray|coolGray|blueGray|redGray|orangeGray|yellowGray|greenGray|tealGray)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["responsive", "hover", "focus", "focus-within"],
    },
    {
      pattern:
        /text-(yellow|blue|green|red|purple|pink|gray|cyan|indigo|emerald|rose|violet|amber|lime|fuchsia|teal|azure|warmGray|trueGray|coolGray|blueGray|redGray|orangeGray|yellowGray|greenGray|tealGray)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["responsive", "hover", "focus", "focus-within"],
    },
  ],
  theme: {
    extend: {
      colors: {
        dark_bg_1: "#111B21",
        dark_bg_2: "#343D55",
        dark_bg_3: "#182229",
        dark_bg_4: "#171D31",
        dark_bg_5: "#283046",
        dark_text_1: "#f1f3f3",
        light_text_1: "#2b2a2a",
        dark_scrollbar: "#374045",
        card_bg: "#fcfcfc",
        eye_black: "#222f3e",
        eye_white: "#f1f3f3",
      },
      boxShadow: {
        outer: "0px 0px 17px -13px rgba(0,0,0,0.75)",
      },
      fontFamily: {
        poppins: "Poppins",
      },
    },
  },
  plugins: [],
};
