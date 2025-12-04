import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Relief Blue (hope, trust)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB', // Main Relief Blue
          600: '#1E40AF', // Deep Education Blue
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
        // Accent: Sunrise Yellow (hope, new beginning)
        accent: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15', // Main Sunrise Yellow
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
        },
        // Warm Orange (warmth, community help)
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C', // Main Soft Orange
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        // Backgrounds
        bg: {
          soft: '#F8FAFC', // Soft mist white
          blue: '#EEF2FF', // Very soft blue
        },
        // Text
        text: {
          primary: '#0F172A', // Slate black
          secondary: '#475569', // Secondary text
        },
        // Success
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem', // 16px - main component radius
        'full': '9999px', // For buttons
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'blue': '0 4px 12px rgba(37, 99, 235, 0.15)',
        'warm': '0 4px 12px rgba(251, 146, 60, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config

