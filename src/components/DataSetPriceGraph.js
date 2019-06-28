import React from 'react'
import colors from 'ui/colors'
import { Chart } from 'react-google-charts'
import Loading from 'components/Loading'

export default ({ data, numberOfProvider }) => (
  <Chart
    width="100%"
    style={{ maxWidth: 'calc(100vw - 320px)' }}
    height={'300px'}
    chartType="SteppedAreaChart"
    loader={
      <Loading
        height={300}
        width={922}
        rects={[[24, 24, 922 - 48, 300 - 48]]}
      />
    }
    data={data}
    options={{
      // title: 'BTC/USD price movement in the past 7 days',
      colors: colors.createChartColors(numberOfProvider),
      legend: { position: 'none' },
      vAxis: {
        format: 'currency',
        textStyle: { color: colors.text.light, fontName: 'Source Code Pro' },
      },
      hAxis: {
        textStyle: {
          color: colors.text.graph,
          fontSize: 11,
          fontName: 'Source Code Pro',
        },
      },
      chartArea: { width: '80%', height: '75%' },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 4.0,
      },
      isStacked: false,
      areaOpacity: 0,
      fontSize: 12,
    }}
    rootProps={{ 'data-testid': '1' }}
  />
)
