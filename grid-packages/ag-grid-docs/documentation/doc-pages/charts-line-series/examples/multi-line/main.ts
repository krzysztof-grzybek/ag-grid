import { AgChartOptions } from '@ag-grid-community/core'
import * as agCharts from 'ag-charts-community'

const options: AgChartOptions = {
  container: document.getElementById('myChart'),
  autoSize: true,
  title: {
    text: 'Fuel Spending (2019)',
  },
  data: [
    {
      quarter: 'Q1',
      petrol: 200,
      diesel: 100,
    },
    {
      quarter: 'Q2',
      petrol: 300,
      diesel: 130,
    },
    {
      quarter: 'Q3',
      petrol: 350,
      diesel: 160,
    },
    {
      quarter: 'Q4',
      petrol: 400,
      diesel: 200,
    },
  ],
  series: [
    {
      xKey: 'quarter',
      yKey: 'petrol',
    },
    {
      xKey: 'quarter',
      yKey: 'diesel',
    },
  ],
}

agCharts.AgChart.create(options)
