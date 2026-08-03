import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#C0392B",
          secondary: "#F39C12",
          background: "#FFF8F0",
          dark: "#1A1A1A"
        }
      },
      fontFamily: {
        heading: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 40px rgba(26, 26, 26, 0.10)",
        glass: "0 20px 60px rgba(192, 57, 43, 0.18)"
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(243,156,18,0.35), transparent 35%), radial-gradient(circle at bottom right, rgba(192,57,43,0.28), transparent 38%)"
      },
      borderRadius: {
        xl2: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
