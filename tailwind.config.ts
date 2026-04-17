import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(228 100% 98%)',
        foreground: 'hsl(240 10% 15%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(240 10% 15%)',
        popover: 'hsl(0 0% 100%)',
        'popover-foreground': 'hsl(240 10% 15%)',
        primary: 'hsl(221 83% 53%)',
        'primary-foreground': 'hsl(0 0% 100%)',
        secondary: 'hsl(274 91% 67%)',
        'secondary-foreground': 'hsl(0 0% 100%)',
        muted: 'hsl(228 25% 95%)',
        'muted-foreground': 'hsl(240 8% 46%)',
        accent: 'hsl(340 82% 52%)',
        'accent-foreground': 'hsl(0 0% 100%)',
        destructive: 'hsl(0 72% 51%)',
        'destructive-foreground': 'hsl(0 0% 100%)',
        border: 'hsl(228 25% 95%)',
        input: 'hsl(228 25% 95%)',
        ring: 'hsl(221 83% 53%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      boxShadow: {
        'glow-primary': '0 0 20px hsl(221 83% 53% / 0.3)',
        'glow-secondary': '0 0 20px hsl(274 91% 67% / 0.3)',
        'glow-accent': '0 0 20px hsl(340 82% 52% / 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(274 91% 67%) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(274 91% 67%) 0%, hsl(340 82% 52%) 100%)',
        'gradient-accent': 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(38 92% 50%) 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
