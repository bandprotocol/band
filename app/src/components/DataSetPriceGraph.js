import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Box } from 'rebass'
import { Chart } from 'react-google-charts'
import Loading from 'components/Loading'

const Container = styled(Box)`
  rect[stroke-opacity] {
    stroke-width: 0 !important;
    stroke: #3b57d1;
  }

  .google-visualization-tooltip-item:not(:first-child) {
    white-space: nowrap;
    width: 200px;
    display: flex;
    align-items: center;

    & > * {
      display: block;
    }
    & > *:last-child {
      margin-left: auto;
      flex: 1;
      text-align: right;
    }
  }
`

export default ({ data, numberOfProvider }) => (
  <Container>
    <Chart
      width="100%"
      style={{ maxWidth: 'calc(100vw - 320px)' }}
      height={'300px'}
      chartType="SteppedAreaChart"
      loader={
        <Loading height={300} width={922} rects={[[0, 24, 922, 300 - 48]]} />
      }
      data={data}
      options={{
        // title: 'BTC/USD price movement in the past 7 days',
        series: {
          0: { targetAxisIndex: 1 },
        },
        colors: colors.createChartColors(numberOfProvider),
        legend: { position: 'none' },
        vAxes: [
          {
            gridlines: {
              color: 'transparent',
            },
          },
          {
            format: '#######.###########',
            textPosition: 'in',
            textStyle: {
              color: colors.text.light,
              fontName: 'Source Code Pro',
            },
            gridlines: {
              color: '#eef3ff',
            },
          },
        ],
        hAxis: {
          textPosition: 'in',
          textStyle: {
            color: colors.text.graph,
            fontSize: 11, // TODO: Change back to 11
            fontName: 'Source Code Pro',
          },
          gridlines: {
            color: '#f3f7ff',
          },
        },
        chartArea: {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        },
        explorer: {
          actions: ['dragToZoom', 'rightClickToReset'],
          axis: 'horizontal',
          keepInBounds: true,
          maxZoomIn: 4.0,
        },
        isStacked: false,
        areaOpacity: 0,
        focusTarget: 'category',
        tooltip: {
          isHtml: true,
          ignoreBounds: true,
        },
        fontSize: 12,
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  </Container>
)
