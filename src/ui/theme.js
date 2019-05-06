import colors from './colors'

export default {
  breakpoints: ['640px', '960px'],
  fontSizes: [14, 16, 18, 20, 24, 32, 48, 64],
  colors: {
    text: colors.text.normal,
    purple: colors.purple.normal,
    'purple-dark': colors.purple.dark,
    'bg-dark': colors.background.dark,
    'bg-light': colors.background.light,
    'bg-lighter': colors.background.lighter,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fonts: {
    sans: 'Montserrat, sans-serif',
  },
  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)',
  },
  buttons: {
    primary: {
      fontFamily: 'Avenir, sans-serif',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: '#fff',
      backgroundColor: colors.blue.normal,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#5a6eef',
      },
    },
    outline: {
      fontFamily: 'Avenir, sans-serif',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: colors.blue.normal,
      backgroundColor: '#fff',
      border: `solid 1px ${colors.blue.normal}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#FFFBFB',
      },
    },

    navy: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '4px 32px',
      background: '#736bf3',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#625bd2',
      },
    },
  },
  cards: {
    primary: {
      background: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 12px 18px 0 rgba(209, 209, 209, 0.32)',
    },
  },
}
