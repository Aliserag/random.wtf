import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0ff, 0 0 80px #0ff, 0 0 90px #0ff, 0 0 100px #0ff, 0 0 150px #0ff' },
          '100%': { textShadow: '0 0 4px #fff, 0 0 10px #fff, 0 0 18px #fff, 0 0 38px #0ff, 0 0 73px #0ff, 0 0 80px #0ff, 0 0 94px #0ff, 0 0 140px #0ff' },
        },
      },
      colors: {
        'neon': {
          pink: '#ff00ff',
          blue: '#00ffff',
          green: '#00ff00',
          yellow: '#ffff00',
          purple: '#9d00ff',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config; 