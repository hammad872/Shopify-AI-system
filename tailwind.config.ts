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
        blue: '#2563EB',
        teal: '#06B6D4',
        green: '#22C55E',
        navy: '#0B132B',
        slate: '#1F2937',
        ash: '#6B7280',
        mist: '#F3F4F6',
        royal: '#2563EB',
        sky: '#60A5FA',
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
