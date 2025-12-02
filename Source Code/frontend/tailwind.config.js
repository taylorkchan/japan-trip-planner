/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F45500',
        'primary-hover': '#E04900',
        'primary-active': '#CC4200',
        link: '#004E8E',
        'link-hover': '#003A6B',
        text: {
          primary: '#192024',
          secondary: '#5A6872',
          placeholder: '#87969F',
        },
        surface: {
          background: '#FFFFFF',
          raised: '#FAFBFC',
          subtle: '#F0F3F5',
          hover: '#F9FAFB',
        },
        border: {
          default: '#E6EBEF',
          strong: '#87969F',
          focus: '#004E8E',
        },
        feedback: {
          info: '#0077CC',
          success: '#008A05',
          warning: '#FFA30F',
          error: '#CC0000',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xs': ['2.75rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['3.25rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h1-xs': ['2rem', { lineHeight: '1.27', fontWeight: '700' }],
        'h1-md': ['2.25rem', { lineHeight: '1.27', fontWeight: '700' }],
        'h1-lg': ['2.75rem', { lineHeight: '1.27', fontWeight: '700' }],
        'h2-xs': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2-md': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2-lg': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-xs': ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h3-md': ['1.375rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h3-lg': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-sm': ['0.875rem', { lineHeight: '1.45', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.3', fontWeight: '400' }],
      },
      spacing: {
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '5': '1.25rem',  // 20px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '12': '3rem',    // 48px
        '16': '4rem',    // 64px
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '999px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,0.08)',
        'elevation-2': '0 4px 10px rgba(0,0,0,0.10)',
        'elevation-3': '0 10px 24px rgba(0,0,0,0.14)',
        'elevation-4': '0 18px 40px rgba(0,0,0,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.2, 0, 0, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.2, 0, 0, 1)',
        'scale-in': 'scaleIn 150ms cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'entrance': 'cubic-bezier(0, 0, 0, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
}