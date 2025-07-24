module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-100px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 1.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
