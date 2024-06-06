// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['index.html', 'src/**/*.{ts,js,tsx,jsx}'],
//   theme: {
//     extend: {
//       boxShadow: {
//         'all': '0 0 15px',
//         'cabCard' : '0 0 5px',
//         'userCard' : '0 0 3px'
//       },
      
//     },
//   },
//   plugins: [
//   ],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', 'src/**/*.{ts,js,tsx,jsx}'],
  theme: {
    extend: {
      width: {
        '0': '0',
        'full': '100%',
      },
      transitionProperty: {
        'width': 'width',
      },
      boxShadow: {
        'all': '0 0 15px',
        'cabCard' : '0 0 5px',
        'userCard' : '0 0 3px'
      },
      backgroundColor: {
        'primary' : '#1f4f77' 
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.underline-transition': {
          'transition-property': 'width',
          'transition-duration': '0.3s',
          'transition-timing-function': 'ease-in-out',
        },
        '.underline-width-0': {
          'width': '0',
        },
        '.underline-width-full': {
          'width': '100%',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}


