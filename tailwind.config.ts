import type { Config } from "tailwindcss";
const config: Config = {
  content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],
  theme:{extend:{colors:{sidebar:"#1C1917",page:"#F0F4F8",accent:"#6366F1",accentLight:"#818CF8",accentBg:"#EEF2FF",ink:"#0F172A",ink2:"#334155",muted:"#64748B",border:"#E8EEF4",surface:"#F8FAFC",green:"#10B981",greenBg:"#ECFDF5",greenText:"#065F46",amber:"#F59E0B",amberBg:"#FFFBEB",amberText:"#92400E",red:"#EF4444",redBg:"#FEF2F2",redText:"#991B1B"},fontFamily:{sans:["DM Sans","system-ui","sans-serif"],mono:["DM Mono","Courier New","monospace"]},boxShadow:{soft:"0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04)",lift:"0 8px 24px rgba(15,23,42,.12)",modal:"0 24px 64px rgba(15,23,42,.25)"}}},
  plugins:[]
};
export default config;
