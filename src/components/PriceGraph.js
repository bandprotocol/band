import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import { colors } from 'ui'

const options = {
  colors: [colors.purple.normal],
  navigator: {
    enabled: false,
  },
  rangeSelector: {
    buttons: [
      {
        type: 'month',
        count: 1,
        text: '1m',
      },
      {
        type: 'month',
        count: 3,
        text: '3m',
      },
      {
        type: 'month',
        count: 6,
        text: '6m',
      },
      {
        type: 'year',
        count: 1,
        text: '1y',
      },
      {
        type: 'all',
        text: 'All',
      },
    ],
    buttonTheme: {
      style: {
        color: colors.text.grey,
      },
      states: {
        select: {
          fill: colors.purple.normal,
          style: {
            color: 'white',
          },
        },
      },
    },
    inputStyle: {
      color: colors.purple.normal,
      fontWeight: 'bold',
      fontSize: '11px',
      fontFamily: 'Montserrat',
    },
  },
  scrollbar: { enabled: false },
  series: [{ data: [] }],
  tooltip: {
    enabled: false,
  },
  yAxis: {
    enabled: false,
    x: -15,
    align: 'right',
    labels: {
      formatter() {
        return this.value
      },
    },
  },
}

export default ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    constructorType={'stockChart'}
    options={{
      ...options,
      series: [
        {
          ...options.series[0],
          data,
          threshold: null,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 0,
            },
            stops: [
              [0, 'rgba(77, 119, 255, 0.3)'],
              [1, 'rgba(69, 57, 255, 0.3)'],
            ],
          },
        },
      ],
      chart: {
        height: 280,
      },
    }}
  />
)
