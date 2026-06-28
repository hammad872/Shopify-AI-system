import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0f',
        surface: '#15151c',
        border: '#26262f',
        muted: '#8a8a99',
        brand: '#6d5efc',
        navy: '#0B132B',
        royal: '#2563EB',
        sky: '#60A5FA',
        green: '#22C55E',
        mint: '#A7F3D0',
        fog: '#F1F5F9',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
