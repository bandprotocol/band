import { get } from 'axios'

export const getBandUSD = async () => {
  try {
    const res = await get(
      'https://api.coingecko.com/api/v3/simple/price?ids=band-protocol&vs_currencies=USD&include_24hr_change=true',
    )
    const price = res.data['band-protocol']
    return price
  } catch (err) {
    console.error(err.message)
    return ''
  }
}
