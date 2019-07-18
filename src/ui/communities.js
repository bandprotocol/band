export const getProfileColor = symbol =>
  ({
    XSP: 'linear-gradient(52deg, #406ae7, #c63ad6)',
    XLT: 'linear-gradient(to left, #ffca55, #ff7155)',
    XFN:
      'linear-gradient(69deg, rgba(190, 60, 218, 0.9), rgba(239, 62, 150, 0.9))',
  }[symbol] || '#fff')

export const getGraphColor = symbol =>
  ({
    XSP: {
      lineStart: 'rgba(0, 104, 255, 1)',
      lineEnd: 'rgba(198, 58, 214, 1)',
      areaStart: 'rgba(0, 104, 255, 1)',
      areaEnd: 'rgba(198, 58, 214, 0.4)',
    },
    XLT: {
      lineStart: 'rgba(255, 202, 85, 1)',
      lineEnd: 'rgba(255, 113, 85, 1)',
      areaStart: 'rgba(255, 202, 85, 1)',
      areaEnd: 'rgba(255, 113, 85, 0.4)',
    },
    XFN: {
      lineStart: 'rgba(190, 60, 218, 1)',
      lineEnd: 'rgba(239, 62, 150, 1)',
      areaStart: 'rgba(190, 60, 218, 1)',
      areaEnd: 'rgba(239, 62, 150, 0.4)',
    },
  }[symbol] || {
    lineStart: 'rgba(0, 104, 255, 1)',
    lineEnd: 'rgba(198, 58, 214, 1)',
    areaStart: 'rgba(0, 104, 255, 1)',
    areaEnd: 'rgba(198, 58, 214, 0.4)',
  })
