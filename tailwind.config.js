/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--mainColor)",
        accent: "rgba(206,153,103,0.12)",
        glassBorder: "rgba(255,255,255,0.12)",
        glassBg: "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["'Noto Sans'", "Roboto", "Ubuntu", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glass-md": "0 8px 32px rgba(16, 24, 40, 0.25)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
