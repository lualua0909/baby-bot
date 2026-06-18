import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['var(--font-baloo)', 'Baloo 2', 'cursive'],
        fredoka: ['var(--font-fredoka)', 'Fredoka', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
        cartoon: ['var(--font-baloo)', 'var(--font-fredoka)', 'var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      keyframes: {
        'caret-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'bubble-bob': {
          '0%, 100%': { transform: 'translateY(0) rotate(-0.5deg)' },
          '50%': { transform: 'translateY(-6px) rotate(0.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-8px) translateX(6px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 0.8s steps(1) infinite',
        'bubble-bob': 'bubble-bob 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
