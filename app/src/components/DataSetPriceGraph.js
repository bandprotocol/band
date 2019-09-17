import React, { Component } from 'react'
import styled from 'styled-components'
import Chart from 'chart.js'
import { AutoSizer } from 'react-virtualized'
import colors from 'ui/colors'
import { Box } from 'rebass'
// import Chart from 'react-google-charts'
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

class Graph extends Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
  }

  componentDidUpdate() {
    // this.myChart.data.labels = this.props.data.map(d => d.time)
    if (!this.cht) return
    this.cht.data.datasets[0].data = this.props.data
    this.cht.update()
  }

  componentDidMount() {
    const canvas = this.chartRef.current
    const ctx = canvas.getContext('2d')
    const gradientStroke = ctx.createLinearGradient(0, 0, this.props.width, 0)
    gradientStroke.addColorStop(0, '#567dfd')
    gradientStroke.addColorStop(1, '#567dfd')

    const cfg = {
      type: 'bar',
      data: {
        datasets: [
          {
            borderColor: gradientStroke,
            data: this.props.data,
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              distribution: 'linear',
              ticks: {
                source: 'data',
                autoSkip: true,
                autoSkipPadding: 15,
                fontFamily: 'Source Code Pro, monospace',
                fontColor: '#567dfd',
                display: true,
                fontSize: 11,
              },
              gridLines: {
                display: false,
                drawBorder: true,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                // display: true,
                labelString: 'BTC-USDT',
              },
              ticks: {
                fontFamily: 'Source Code Pro, monospace',
                fontColor: '#567dfd',
              },
              gridLines: {
                display: false,
                // drawBorder: false,
              },
            },
          ],
        },
        tooltips: {
          // enabled: false,
        },
      },
    }

    this.cht = new Chart(ctx, cfg)
  }

  render() {
    const { width, height } = this.props
    return (
      <div style={{ width, height }}>
        <canvas style={{ width, height }} ref={this.chartRef} />
      </div>
    )
  }
}

export default ({ data, numberOfProvider }) => {
  const init = data.slice(1).map(d => {
    return {
      x: d[0],
      y: d[1],
    }
  })

  return (
    <Container>
      <Box width="100%" px={['', '50px']} mt="30px">
        <AutoSizer disableHeight>
          {({ width }) => {
            if (width) {
              return <Graph data={init} width={width} />
            }
          }}
        </AutoSizer>
      </Box>
    </Container>
  )
}
