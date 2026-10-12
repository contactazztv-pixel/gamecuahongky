/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          brick: '#E06D53',
          roof: '#C84B31',
          gate: '#1F4287',
          wall: '#FBE8A6',
          chalkboard: '#2D4059',
          tree: '#4E9F3D',
          sky: '#D4EBF8',
          accent: '#FFB26B',
        },
        pastel: {
          cream: '#FFFDF9',
          parchment: '#FDF6EC',
          toast: '#FCE7C8',
          tea: '#B3C890',
          peach: '#FFB4B4',
          taro: '#E2BFD9',
          brownSugar: '#795548',
          gold: '#FFD369',
          leaf: '#A8DF8E',
          sky: '#E0F4FF',
        },
        wood: {
          light: '#DEBA9D',
          dark: '#9E7676',
          border: '#6B4F4F',
        }
      },
      fontFamily: {
        game: ['Nunito', 'Segoe UI', 'sans-serif'],
        hand: ['Caveat', 'Segoe Print', 'cursive'],
      },
      boxShadow: {
        'game-sm': '0 2px 0 0 rgba(0,0,0,0.15)',
        'game': '0 4px 0 0 rgba(0,0,0,0.18)',
        'game-lg': '0 6px 0 0 rgba(0,0,0,0.22)',
        'game-press': '0 1px 0 0 rgba(0,0,0,0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        steam: {
          '0%': { opacity: '0.8', transform: 'translateY(0) scale(0.9)' },
          '50%': { opacity: '0.4', transform: 'translateY(-8px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-16px) scale(1.3)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        floatUpFade: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(0.95)' },
          '100%': { opacity: '0', transform: 'translateY(-36px) scale(1.15)' },
        },
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'steam': 'steam 2.5s ease-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'walk': 'walk 1s steps(2) infinite',
        'float-up': 'floatUpFade 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
