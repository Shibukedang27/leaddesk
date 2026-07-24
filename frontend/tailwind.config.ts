import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#ffffff',
        background: '#f8fafc',
        surface: '#ffffff',
        glass: 'rgb(255 255 255 / 72%)',
        text: '#0f172a',
        muted: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#e11d48',
      },
      borderRadius: {
        card: '24px',
      },
      boxShadow: {
        premium: '0 24px 80px rgb(15 23 42 / 10%)',
        soft: '0 12px 40px rgb(15 23 42 / 8%)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      animation: {
        'fade-in': 'fade-in 320ms ease-out both',
        'slide-up': 'slide-up 360ms ease-out both',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
