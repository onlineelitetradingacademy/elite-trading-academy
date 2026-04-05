/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:  { DEFAULT: '#F0A500', light: '#FFD166', dark: '#C8860A' },
        dark:  { DEFAULT: '#0A0A0F', 900: '#0A0A0F', 800: '#0D0D15', 700: '#12121C', 600: '#1A1A28', 500: '#222235', 400: '#2E2E45' },
        navy:  { DEFAULT: '#0D1B2A', light: '#1A2E45' },
        profit:'#00C853',
        loss:  '#FF3D57',
        muted: '#8B8FA8',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(240,165,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,165,0,0.03) 1px, transparent 1px)',
        'hero-glow':    'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.15), transparent)',
        'card-glow':    'radial-gradient(ellipse at top, rgba(240,165,0,0.08), transparent 70%)',
      },
      backgroundSize: { 'grid-pattern': '60px 60px' },
      animation: {
        'ticker':     'ticker 30s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'count-up':   'count-up 2s ease-out forwards',
        'slide-up':   'slide-up 0.6s ease-out forwards',
        'fade-in':    'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        ticker:       { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'glow-pulse':  { '0%,100%': { boxShadow: '0 0 20px rgba(240,165,0,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(240,165,0,0.4)' } },
        'slide-up':    { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':     { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      boxShadow: {
        'gold': '0 0 30px rgba(240,165,0,0.3)',
        'gold-sm': '0 0 10px rgba(240,165,0,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
