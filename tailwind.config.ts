import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        kid: {
          pink: '#FF6B9D',
          purple: '#9B59B6',
          blue: '#3498DB',
          green: '#2ECC71',
          yellow: '#F1C40F',
          orange: '#F39C12',
          sky: '#87CEEB',
        },
        // Talking-Tom style palette (matched to reference art)
        tom: {
          lime: '#A7D02C',
          'lime-dark': '#7FA017',
          red: '#E8453C',
          'red-dark': '#B92F28',
          teal: '#52C3D0',
          'teal-dark': '#3AA1AE',
          wood: '#C8915C',
          'wood-dark': '#9C6B3D',
          coin: '#F6C026',
          gem: '#4FC3F7',
        },
      },
      animation: {
        bounce: 'bounce 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
