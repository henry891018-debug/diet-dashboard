import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F6F2",
        surface: "#ffffff",
        border: "#E5E3DC",
        border2: "#CCCAB8",
        text: "#1A1A18",
        muted: "#7A7870",
        hint: "#B0AEA6",
        accent: "#2D6A4F",
        "accent-l": "#E8F4EE",
        "accent-d": "#1A4A35",
        pro: "#1D6FA4",
        "pro-l": "#E8F2FA",
        warn: "#B5450B",
        "warn-l": "#FAF0EB",
        amber: "#BA7517",
        "amber-l": "#FAEEDA",
        purple: "#534AB7",
        "purple-l": "#EEEDFE",
        green: "#3B6D11",
        "green-l": "#EAF3DE",
      },
      borderRadius: {
        rad: "10px",
        "rad-sm": "6px",
      },
    },
  },
  plugins: [],
};

export default config;
