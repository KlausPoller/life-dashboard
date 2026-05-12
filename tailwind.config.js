/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#080C14',
        surface: '#0F1624',
        'border-subtle': '#1E2D45',
        health: '#00C2FF',
        finance: '#F5A623',
        habits: '#A78BFA',
        calendar: '#34D399',
        'text-muted': '#64748B',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
