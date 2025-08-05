// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        bannerFlow: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-2%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        bannerFlow: 'bannerFlow 20s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
