import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '/node_modules/react-tailwindcss-select/dist/index.esm.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
