import colors from './colors'

export default {
  breakpoints: ['640px', '960px'],
  fontSizes: [14, 16, 18, 20, 24, 32, 48, 64],
  colors: {
    text: colors.text.normal,
    purple: colors.purple.normal,
    'purple-dark': colors.purple.dark,
    'bg-light': colors.background.light,
    'bg-lighter': colors.background.lighter,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fonts: {
    sans: 'Avenir',
  },
  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)',
  },
  buttons: {
    primary: {
      fontFamily: 'Avenir',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: '#fff',
      backgroundColor: colors.purple.normal,
      border: `solid 1px ${colors.purple.normal}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#7E5CFD',
      },
    },
    outline: {
      fontFamily: 'Avenir',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: colors.purple.normal,
      backgroundColor: '#fff',
      border: `solid 1px ${colors.purple.normal}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#FFFBFB',
      },
    },
    grey: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: colors.text.grey,
      border: `solid 0px ${colors.text.grey}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#b4bbda',
      },
    },
    submit: {
      fontFamily: 'Avenir',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: '#fff',
      backgroundColor: colors.green.normal,
      border: `solid 1px ${colors.green.normal}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#0eb23f',
      },
    },
    cancel: {
      fontFamily: 'Avenir',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: '#fff',
      backgroundColor: colors.red.normal,
      border: `solid 1px ${colors.red.normal}`,
      transition: 'all 250ms',
      '&:hover': {
        backgroundColor: '#d61330',
      },
    },
    disable: {
      fontFamily: 'Avenir',
      fontWeight: 400,
      fontSize: '0.85em',
      padding: '0.9em 3em',
      cursor: 'pointer',
      color: '#b1b8e7',
      backgroundColor: '#e8ebfd',
    },
  },
  cards: {
    primary: {
      border: `solid 1px #e7ecff`,
      borderRadius: 5,
      boxShadow: '0 12px 12px 0 #f3f5ff;',
    },

    detail: {
      border: `solid 1.5px #e7ecff`,
      borderRadius: 4,
      width: '100%',
      marginBottom: '20px',
    },

    modal: {
      border: `solid 1px #e7ecff`,
      borderRadius: 4,
      background: '#fff',
    },
  },
}
