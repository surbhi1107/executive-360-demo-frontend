/** Design tokens mirror the Executive 360° design system. Colours are CSS variables (see src/index.css)
 *  so Light / Dark / Automatic switch without any `dark:` variants. */
const v = (name) => `var(--${name})`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), fill: v('fill'),
        ink: v('ink'), mute: v('ink-secondary'),
        sep: v('separator'), ctl: v('control-border'),
        accent: v('accent'), 'on-accent': v('on-accent'), 'accent-soft': v('accent-soft'),
        positive: v('positive'), caution: v('caution'), critical: v('critical'),
        'chart-line': v('chart-line'), 'chart-area': v('chart-area'), scrim: v('scrim'),
      },
      boxShadow: { card: v('shadow-card'), raised: v('shadow-raised') },
      borderRadius: { sm: '8px', md: '14px', lg: '22px' },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'system-ui', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      // text-<size> sets font-size and line-height together, as in the original type scale
      fontSize: {
        10: ['10px', '12px'], 11: ['11px', '14px'], 12: ['12px', '16px'], 13: ['13px', '18px'],
        14: ['14px', '19px'], 15: ['15px', '22px'], 16: ['16px', '21px'], 17: ['17px', '23px'],
        18: ['18px', '24px'], 20: ['20px', '26px'], 22: ['22px', '28px'], 24: ['24px', '30px'],
        26: ['26px', '32px'], 28: ['28px', '34px'], 30: ['30px', '36px'], 34: ['34px', '40px'],
        40: ['40px', '44px'], 56: ['56px', '60px'],
      },
      keyframes: { blink: { '0%,80%,100%': { opacity: '.25' }, '40%': { opacity: '1' } } },
      animation: { blink: 'blink 1s infinite' },
    },
  },
  plugins: [],
}
