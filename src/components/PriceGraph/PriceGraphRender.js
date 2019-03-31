import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import { colors } from 'ui'

import { Box } from 'ui/common'

import moment from 'utils/moment'

import './style.css'

const options = {
  colors: [colors.purple.normal],
  navigator: {
    enabled: false,
  },
  scrollbar: { enabled: false },
  tooltip: {
    enabled: true,
    formatter: function(tooltip) {
      return `
      ${moment(this.x).priceDate()}<br>
      Price: ${this.y}`
    },
  },
  xAxis: {
    ordinal: false,
    title: {
      text: 'Token supply',
    },
  },
  yAxis: {
    tickPixelInterval: 35,
    labels: {
      formatter() {
        return this.value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      },
    },
    min: 0,
  },
  rangeSelector: {
    buttons: [
      {
        type: 'month',
        count: 1,
        text: '1 M',
      },
      {
        type: 'month',
        count: 3,
        text: '3 M',
      },
      {
        type: 'month',
        count: 6,
        text: '6 M',
      },
      {
        type: 'year',
        count: 1,
        text: '1 Y',
      },
      {
        type: 'all',
        text: 'All',
      },
    ],
  },
  plotOptions: {
    line: {
      animation: false,
    },
    spline: {
      marker: {
        enabled: true,
      },
    },
  },
}

class HighChartGraph extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data
  }
  render() {
    const {
      data,
      onMouseOverPoint,
      onMouseOut,
      width = 100,
      height = 330,
    } = this.props
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={{
          ...options,
          series: [
            {
              data,
              events: {
                mouseOut: onMouseOut,
              },
              point: {
                events: {
                  mouseOver: onMouseOverPoint,
                },
              },
              type: 'area',
              threshold: null,
              fillColor: '#ede8ff',
            },
          ],

          chart: {
            width,
            height,
            styledMode: true,
          },
        }}
      />
    )
  }
}

class Graph extends React.PureComponent {
  state = { hovering: null }
  render() {
    const { data, height, width } = this.props
    return (
      <React.Fragment>
        <Box>
          <HighChartGraph
            height={height}
            width={width}
            onMouseOverPoint={event =>
              this.setState({
                hovering: { y: event.target.y, x: event.target.x },
              })
            }
            onMouseOut={() => this.setState({ hovering: null })}
            data={data}
          />
        </Box>
      </React.Fragment>
    )
  }
}

export default Graph
