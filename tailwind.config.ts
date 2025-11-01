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
          50: '#fff3f2',
          100: '#ffe4e1',
          200: '#ffc4bf',
          300: '#ff9f97',
          400: '#f6715f',
          500: '#e6443b',
          600: '#c73a34',
          700: '#a4302c',
          800: '#842723',
          900: '#6b1f1d',
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

