export const getProfileColor = symbol =>
  ({
    XSP: 'linear-gradient(52deg, #406ae7, #c63ad6)',
    XLT: 'linear-gradient(to left, #ffca55, #ff7155)',
    XFN:
      'linear-gradient(69deg, rgba(190, 60, 218, 0.9), rgba(239, 62, 150, 0.9))',
  }[symbol] || '#fff')
