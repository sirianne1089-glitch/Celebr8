import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Premium brand palette: warm gold, deep maroon, ivory, soft purple
        ink: {
          DEFAULT: "#15131A",
          soft: "#5F5A6B",
          mute: "#8B8498",
        },
        cream: {
          50: "#FFFCF6",
          100: "#FFF8EC",
          200: "#FBEFD9",
        },
        gold: {
          50: "#FFF8E1",
          100: "#FFEBB3",
          200: "#FFD980",
          300: "#F5C04C",
          400: "#E8A92B",
          500: "#C68A12",
          600: "#9A6A0C",
        },
        maroon: {
          50: "#FBEBEC",
          100: "#F2CDD0",
          200: "#E59FA5",
          300: "#C95F69",
          400: "#A53743",
          500: "#7F1F2C",
          600: "#5A1320",
        },
        royal: {
          50: "#F1EEFB",
          100: "#DCD3F4",
          200: "#B7A6E6",
          300: "#8C75D2",
          400: "#6B52B9",
          500: "#4F389B",
          600: "#392671",
        },
        teal: {
          DEFAULT: "#1D9E75",
          soft: "#E6F7EF",
        },
        line: "#E5E0ED",
        line2: "#CFC7DC",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "var(--font-fraunces)",
          "Fraunces",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        deco: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      boxShadow: {
        card: "0 24px 80px rgba(36, 24, 64, 0.10)",
        glow: "0 0 60px rgba(245, 192, 76, 0.35)",
        deep: "0 30px 90px rgba(36, 24, 64, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
        floatAlt: {
          "0%, 100%": { transform: "translateY(-6px) rotate(2deg)" },
          "50%": { transform: "translateY(8px) rotate(-1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rotateSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        floatAlt: "floatAlt 9s ease-in-out infinite",
        shimmer: "shimmer 5s linear infinite",
        rotateSlow: "rotateSlow 40s linear infinite",
        sparkle: "sparkle 3.5s ease-in-out infinite",
      },
      backgroundImage: {
        "premium-gradient":
          "radial-gradient(at 20% 12%, #FFF1D8 0, transparent 38%), radial-gradient(at 82% 18%, #EDE9FF 0, transparent 42%), radial-gradient(at 50% 88%, #F0FBF7 0, transparent 50%), linear-gradient(135deg, #FFFCF6, #F8F5FF 42%, #F0FBF7)",
        "gold-gradient":
          "linear-gradient(120deg, #C68A12, #F5C04C 40%, #FFEBB3 65%, #C68A12)",
      },
    },
  },
  plugins: [],
};

export default config;
