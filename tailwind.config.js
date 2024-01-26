/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg": "#22272e",
        "bgdark": "#1c2128",
        "main": "#f57c00",
        "maindark": "#d66d02",
        "secondary": "#03a9f4",
        "secondarydark": "#0276aa",
        "success": "#27ea60",
        "error": "#c0392b",
        "warning": "#e67e22",
        "warningdark": "#ab5e1a",
        "hr": "#444c56",
        "hrdark": "#292e36",
        "textlight": "#9ca3af",
        "admin": "#2563eb"
      },
    },
  },
  plugins: [],
}

