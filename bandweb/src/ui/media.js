export default {
  mobile: '@media only screen and (max-width: 640px)',
  tablet: '@media only screen and (max-width: 960px)',
}

export const isMobile = () => window.innerWidth <= 640
export const isTablet = () => window.innerWidth <= 960
