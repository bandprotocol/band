import React from 'react'
import { Chart, Line } from 'react-chartjs-2'
import 'chartjs-plugin-downsample'
import colors from 'ui/colors'

Chart.defaults.global.defaultFontSize = 16
Chart.defaults.global.elements.point.radius = 0
Chart.defaults.global.elements.point.hitRadius = 10
Chart.defaults.global.elements.point.hoverRadius = 10

const compileDatasets = (stacked, xDataset, yDatasets) => {
  return yDatasets.map((dataSet, index) => {
    return {
      label: dataSet.label,
      fillColor: 'rgba(220,220,220,0.2)',
      strokeColor: 'rgba(220,220,220,1)',
      pointColor: colors.purple.normal,
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: dataSet.data.map((y, i) => ({ x: xDataset[i], y: y })),
    }
  })
}

export default ({
  stacked = false,
  xDataset,
  yDatasets,
  title,
  xLabel,
  yLabel,
}) => {
  const chartData = {
    labels: xDataset,
    datasets: compileDatasets(stacked, xDataset, yDatasets),
  }

  // DEBUG
  // console.log('x-data', xDataset)
  // console.log('y-data', yDatasets[0].data)

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
    scales: {
      xAxes: [
        {
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
            display: true,
            labelString: yLabel,
          },
        },
      ],
    },
    // downsample: {
    //  enabled: true,
    //  threshold: 1000,
    // },
  }

  return (
    <Line data={chartData} options={chartOptions} width={720} height={500} />
  )
}
