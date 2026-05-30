import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071126",
        ink2: "#253B5A",
        muted: "#64748B",
        surface: "#EEF3F8",
        border: "#DDE7F0",
        accent: "#5B5CF6",
        accentBg: "#EEF0FF",
        sidebar: "#191613",
        green: "#059669",
        greenBg: "#E7F8EF",
        amber: "#B45309",
        amberBg: "#FFF7E6",
        red: "#DC2626",
        redBg: "#FEF2F2"
      }
    }
  },
  plugins: []
};
export default config;
