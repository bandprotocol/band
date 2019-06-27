import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { Box } from 'ui/common'
import moment from 'utils/moment'
import './style.css'

const options = {
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
    title: false,
    gapGridLineWidth: 0,
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
    enabled: false,
    // buttons: [
    //   {
    //     type: 'hour',
    //     count: 1,
    //     text: '1h',
    //   },
    //   {
    //     type: 'day',
    //     count: 1,
    //     text: '1D',
    //   },
    //   {
    //     type: 'all',
    //     count: 1,
    //     text: 'All',
    //   },
    // ],
    // selected: 1,
    // inputEnabled: false,
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
      <React.Fragment>
        <svg height={0}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#496BFF" />
              <stop offset="100%" stopColor="#6FCBFF" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 104, 255, 1)" />
              <stop offset="100%" stopColor="rgba(0, 104, 255, 0.15)" />
            </linearGradient>
          </defs>
        </svg>
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
              },
            ],

            chart: {
              width,
              height: height - 20,
              styledMode: true,
            },
          }}
        />
      </React.Fragment>
    )
  }
}

class Graph extends React.Component {
  state = { hovering: null }

  shouldComponentUpdate(prevProps) {
    return (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width ||
      !prevProps.data ||
      !Array.isArray(prevProps.data) ||
      prevProps.data.slice(-1).length < 1 ||
      !this.props.data.slice(-1)[0] ||
      prevProps.data.slice(-1)[0][0] !== this.props.data.slice(-1)[0][0]
    )
  }

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
