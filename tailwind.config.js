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
        'cabCard' : '0 0 15px',
        'userCard' : '0 0 3px'
      },
      backgroundColor: {
        'primary' : '#1f4f77' 
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.25)',
        'default': '2px 2px 4px rgba(0, 0, 0, 0.25)',
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.25)',
        'xl': '4px 4px 8px rgba(255, 255, 255, 0.25)',
        'none': 'none',
      },
      screens: {
        scxl: '1073px',
        scsm: '529px',
        rcsm: '721px',
        rcxs: '400px'
      },
      backgroundImage: {
        "heroBg": "url('/src/assets/contactbg.webp')",
      },
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
        '.text-shadow-sm': {
          textShadow: `1px 1px 0 rgba(255,255,255,0.9), 
               2px 2px 0 rgba(255,255,255,0.7), 
               3px 3px 0 rgba(255,255,255,0.5), 
               4px 4px 0 rgba(255,255,255,0.3), 
               5px 5px 0 rgba(255,255,255,0.1)`,
        },
        '.text-shadow': {
          textShadow: `1px 1px 0 rgba(96,165,250,0.9), 
          2px 2px 0 rgba(96,165,250,0.7), 
          3px 3px 0 rgba(96,165,250,0.5), 
          4px 4px 0 rgba(96,165,250,0.3), 
          5px 5px 0 rgba(96,165,250,0.1)`,
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.25)',
        },
        '.text-shadow-xl': {
          textShadow: '10px 10px 10px rgba(255, 255, 255, 1)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}


