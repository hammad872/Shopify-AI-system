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
      },
    },
  },
  plugins: [],
} satisfies Config;
