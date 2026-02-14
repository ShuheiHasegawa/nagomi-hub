import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS変数を使用するカスタムカラー
        'base-100': 'var(--color-base-100)',
        'base-200': 'var(--color-base-200)',
        'base-300': 'var(--color-base-300)',
        'base-content': 'var(--color-base-content)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          content: 'var(--color-primary-content)',
          50: '#f0f9f4',
          100: '#dcefe3',
          200: '#b8dfc7',
          300: '#a8d5ba',
          400: '#7bb896',
          500: '#5a9d7a',
          600: '#457d61',
          700: '#38644e',
          800: '#2e5041',
          900: '#274236',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          content: 'var(--color-secondary-content)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          content: 'var(--color-accent-content)',
          orange: '#FFB88C',
          blue: '#B8E0F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-quicksand)', 'var(--font-noto)', 'sans-serif'],
      },
      animation: {
        breath: 'breath 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
