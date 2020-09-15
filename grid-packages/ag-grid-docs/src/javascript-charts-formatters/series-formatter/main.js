var data = [
    {
        country: 'Spain',
        gdp: 1419
    },
    {
        country: 'UK',
        gdp: 2855
    },
    {
        country: 'Germany',
        gdp: 3948
    },
    {
        country: 'France',
        gdp: 2778
    }
];

var options = {
    container: document.getElementById('myChart'),
    title: {
        text: 'GDP by country in billions of USD (2018)'
    },
    data: data,
    series: [{
        type: 'column',
        xKey: 'country',
        yKeys: ['gdp'],
        showInLegend: false,
        formatter: params => {
            return {
                fill: params.datum[params.xKey] === 'UK'
                    ? (params.highlighted ? 'lime' : 'red')
                    : params.fill
            };
        }
    }]
};

agCharts.AgChart.create(options);