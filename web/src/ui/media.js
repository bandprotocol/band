export default {
  smallMobile: '@media only screen and (max-width: 330px)',
  mobile: '@media only screen and (max-width: 640px)',
  tablet: '@media only screen and (max-width: 960px)',
}

export const isSmallMobile = () => window.innerWidth <= 330
export const isMobile = () => window.innerWidth <= 640
export const isTablet = () => window.innerWidth <= 960
