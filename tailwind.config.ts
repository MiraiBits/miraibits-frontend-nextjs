import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fec7d8',
          300: '#f998b7',
          400: '#f4719d',
          500: '#ef4c87',
          600: '#da2c70',
          700: '#b3205a',
          800: '#921c4d',
          900: '#7a1a45',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;


