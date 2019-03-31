import React from 'react'
import { Chart, Line } from 'react-chartjs-2'
import 'chartjs-plugin-downsample'

Chart.defaults.global.defaultFontSize = 11
Chart.defaults.global.elements.point.radius = 0
Chart.defaults.global.elements.point.hitRadius = 10
Chart.defaults.global.elements.point.hoverRadius = 10

export default ({
  stacked = false,
  dataset,
  title,
  xLabel,
  yLabel,
  config,
  width,
  height,
  currentSupply,
  verticalLine,
  yAxes,
}) => {
  const lineStyle = {
    lineTension: 0.1,
    borderColor: '#4853ff',
    backgroundColor: 'rgb(220, 227, 255)',
    borderCapStyle: 'butt',
    borderWidth: 1,
    borderJoinStyle: 'miter',
    pointBorderColor: '#4853ff',
    pointBackgroundColor: '#4853ff',
    pointHoverRadius: 2,
    pointHoverBackgroundColor: 'rgb(78, 60, 169)',
    pointHoverBorderColor: 'rgb(78, 60, 169)',
    pointHoverBorderWidth: 1.5,
  }
  const data = {
    labels: dataset.map(e => e.x),
    datasets: [
      {
        ...lineStyle,
        label: 'Hello',
        fill: true,
        data: verticalLine
          ? dataset
              .map(e => ({ x: e.x, y: e.y }))
              .filter(e => parseFloat(e.x.replace(/,/g, '')) <= currentSupply)
          : dataset.map(e => e.y),
        install: verticalLine && 10,
      },
      {
        ...lineStyle,
        label: '2',
        fill: false,
        data: verticalLine
          ? dataset
              .map(e => ({ x: e.x, y: e.y }))
              .filter(e => parseFloat(e.x.replace(/,/g, '')) >= currentSupply)
          : [],
      },
    ],
  }

  const chartOptions = {
    maintainAspectRatio: true,
    title: {
      display: true,
      text: title,
    },
    tooltips: {
      callbacks: {
        title: (items, data) => `x: ${items[0].xLabel}`,
        label: (item, data) => `y: ${item.yLabel}`,
      },
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          scaleLabel: {
            display: true,
            labelString: xLabel,
          },
        },
      ],
      yAxes: [
        {
          stacked: stacked,
          scaleLabel: {
            display: yLabel,
            labelString: yLabel,
          },
          position: yAxes || 'left',
          ticks: {
            stepSize: config.stepSize, // congifure for each graph
            suggestedMax: config.suggestedMax, // congifure for each graph
            suggestedMin: 0,
          },
        },
      ],
    },
  }

  return (
    <Line data={data} options={chartOptions} width={width} height={height} />
  )
}
