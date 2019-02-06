import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import { colors } from 'ui'

import { Text, Box } from 'ui/common'

import moment from 'utils/moment'

const options = {
  colors: [colors.purple.normal],
  navigator: {
    enabled: false,
  },
  rangeSelector: {
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
      fontWeight: '600',
      fontSize: '11px',
      fontFamily: 'Montserrat',
    },
  },
  scrollbar: { enabled: false },
  tooltip: {
    enabled: false,
  },
  xAxis: {
    ordinal: false,
  },
  yAxis: {
    tickPixelInterval: 35,
    labels: {
      formatter() {
        return this.value
      },
    },
  },
  plotOptions: {
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
    const { data, onMouseOverPoint, onMouseOut } = this.props
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
            },
          ],

          chart: {
            height: 240,
          },
        }}
      />
    )
  }
}

class Graph extends React.PureComponent {
  state = { hovering: null }

  renderPrice = data => {
    if (!data || data.length === 0) return null
    const { hovering } = this.state

    if (hovering) {
      return (
        <React.Fragment>
          <Text fontSize={5} block weight="semibold">
            {`${hovering.y.toFixed(2)} BAND`}
          </Text>
          <Text size={13}>{moment.utc(hovering.x).pretty()}</Text>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Text fontSize={5} block weight="semibold">
          {`${data[data.length - 1][1].toFixed(2)} BAND`}
        </Text>
        <Text fontSize={1}>{`Last price at ${moment
          .utc(data[data.length - 1][0])
          .pretty()}`}</Text>
      </React.Fragment>
    )
  }
  render() {
    const { data } = this.props
    return (
      <React.Fragment>
        <Box>
          <Box
            bg="white"
            style={{
              textAlign: 'center',
              zIndex: 10,
              textShadow: '0 0 5px white',
            }}
            mb={5}
          >
            {this.renderPrice(data)}
          </Box>
          <HighChartGraph
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
