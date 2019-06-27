export const getProvider = address =>
  ({
    '0xda7af0fd57c5d2e918704f034fd9e13aeb28ad13': {
      name: 'COINBASE',
    },
    '0xda7a01d6d7568868b21a6789968b06bb3af5c191': {
      name: 'BITSTAMP',
    },
    '0xda7a2a9c0bb0f94f9ddf54dde3dbe2530a8269a2': {
      name: 'BITFINEX',
    },
    '0xda7a2e3d741f025010c44afa2a6a7353f70d6b23': {
      name: 'GEMINI',
    },
    '0xda7a6811d4dd6a6b0f0ef1f1fe2f99ecd0ce9b7a': {
      name: 'KRAKEN',
    },
    '0xda7af2d3f2321e815cf3841bd0d9a889de22e37c': {
      name: 'CMC',
    },
    '0xda7a814e8b96417274466e2492298b039a854a8c': {
      name: 'CRYPTOCOMPARE',
    },
    '0xda7a6db349b7ae544234f91abd01dd825b8969cd': {
      name: 'OPENMARKETCAP',
    },
    '0xda7adb240fb99dcd55e19a17b97ac2163d4d4509': {
      name: 'ONCHAINFX',
    },
    '0xda7a3c7309bd2de2e89a554191b2d7c71125186c': {
      name: 'BANCOR',
    },
    '0xda7aeec22311453193c55af63ef7f2df4e6a73d2': {
      name: 'KYBER',
    },
    '0xda7a7f095be77012679df0744d8a163823c0558e': {
      name: 'UNISWAP',
    },
    '0xda7aa2bba8685f9c0ddbc53ab8e19a6a32dc8b7f': {
      name: 'FREE_FOREX',
    },
    '0xda7a79196ddd8ad788a996efafea15bf0879c31c': {
      name: 'ALPHAVANTAGE',
    },
    '0xda7af1118c2c5f2edb0d452a84be91e7b47014cb': {
      name: 'CURRENCY_CONVERTER_API',
    },
    '0xda7a238d208eda262505d43678b7d7f180a9ee69': {
      name: 'API_RATESAPI_IO',
    },
    '0xda7ae92ef9089f9093e9555b6cf2fd3e29e3d6d7': {
      name: 'FINANCIAL_MODELING_PREP',
    },
    '0xda7aa81514ae2108da300639d46aa399abaefa05': {
      name: 'WORLD_TRADING_DATA',
    },
  }[address] || { name: 'Unknown' })
