/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        border: "#E5E5E0",
        input: "#E5E5E0",
        ring: "#4A6741",
        background: "#FAFAF9",
        foreground: "#1A1C19",
        primary: {
          DEFAULT: "#4A6741",
          foreground: "#FFFFFF",
          hover: "#3A5233"
        },
        secondary: {
          DEFAULT: "#F2F0E9",
          foreground: "#2C3329"
        },
        accent: {
          DEFAULT: "#C87963",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "#E5E7EB",
          foreground: "#6B7280"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1C19"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF"
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}