import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark accent (used for feature sections: hero backdrop, reserve, quote)
        navy: {
          DEFAULT: '#0F1226',
          deep: '#0A0C1C',
          surface: '#1A1E3A',
          muted: '#2A2F52',
        },
        // Brand yellow brush accent (unchanged)
        accent: {
          DEFAULT: '#F0E65A',
          glow: '#FFF27A',
          deep: '#D4C42E',
        },
        // Cream paper — new DEFAULT background
        paper: {
          DEFAULT: '#F5F1E8',
          warm: '#FAF7EF',
          light: '#FFFDF7',
          muted: '#7A7566',
          line: '#D9D2C1',
        },
        // Dark ink for text on paper
        ink: {
          DEFAULT: '#14162A',
          soft: '#2B2E45',
          muted: '#5A5E75',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        brush: ['var(--font-caveat)', 'cursive'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
