import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg-cockpit)",
        track: "var(--color-bg-track)",
        surface: "var(--color-surface-1)",
        surfaceAlt: "var(--color-surface-2)",
        text: "var(--color-text-primary)",
        muted: "var(--color-text-secondary)",
        borderSoft: "var(--color-border-soft)",
        turbo: "var(--color-turbo-red)",
        overtake: "var(--color-overtake-orange)",
        nitro: "var(--color-neon-blue)",
        podium: "var(--color-podium-gold)",
        win: "var(--color-win-green)",
        danger: "var(--color-danger)",
      },
      spacing: {
        lane: "var(--space-5)",
        pit: "var(--space-7)",
      },
      borderRadius: {
        shell: "var(--radius-xl)",
        card: "var(--radius-lg)",
        control: "var(--radius-md)",
        chip: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        soft: "var(--shadow-soft)",
        blueGlow: "var(--glow-blue)",
        redGlow: "var(--glow-red)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        base: "var(--motion-base)",
        slow: "var(--motion-slow)",
      },
      transitionTimingFunction: {
        race: "var(--ease-out-race)",
      },
    },
  },
  plugins: [],
};

export default config;
