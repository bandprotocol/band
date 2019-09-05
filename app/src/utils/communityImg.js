import SportSrc from 'images/sport.png'
import WebRequestSrc from 'images/web.png'
import FinanceSrc from 'images/finance.png'
import LotterySrc from 'images/lottery.png'

import SportBannerSrc from 'images/sport-banner.png'
import WebRequestBannerSrc from 'images/web-banner.png'
import FinanceBannerSrc from 'images/finance-banner.png'
import LotteryBannerSrc from 'images/lottery-banner.png'

export const logoCommunityFromSymbol = symbol => {
  switch (symbol) {
    case 'XWB':
      return WebRequestSrc
    case 'XFN':
      return FinanceSrc
    case 'XSP':
      return SportSrc
    case 'XLT':
      return LotterySrc
    default:
      return WebRequestSrc
  }
}

export const bannerCommunityFromSymbol = symbol => {
  switch (symbol) {
    case 'XWB':
      return WebRequestBannerSrc
    case 'XFN':
      return FinanceBannerSrc
    case 'XSP':
      return SportBannerSrc
    case 'XLT':
      return LotteryBannerSrc
    default:
      return WebRequestBannerSrc
  }
}
