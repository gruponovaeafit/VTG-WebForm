import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ea: ['"EA Font"', "sans-serif"],  
        pressStart2P: ['"Press Start 2P"', "serif"],
      },
      fontSize: {
        xxs: "10px",
        tiny: "12px", 
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Fix para iOS Safari - usar dvh (dynamic viewport height)
      height: {
        screen: "100dvh",
      },
      minHeight: {
        screen: "100dvh",
      },
      maxHeight: {
        screen: "100dvh",
      },
      animation: {
        fastPulse: 'pulse 0.1s ease-in-out infinite',
        growShrink: 'growShrink 1.5s infinite ease-in-out', 
      },
      keyframes: {
        growShrink: {
          '0%, 100%': { transform: 'scale(1)' }, // Tamaño normal
          '50%': { transform: 'scale(1.2)' },  // Tamaño aumentado
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
