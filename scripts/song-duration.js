/*Chapter 1 - Chart*/
let ctx = document.getElementById('song-duration').getContext('2d');

let myChart;
let JSONdata;

fetch("./data/duration_evolution.json")
    .then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
    })
    .then(function (data) {
        JSONdata = data;
        createChart(JSONdata, 'line');
    });


function createChart(data, type) {

    const chartData = {
        labels: data.map(row => row.year),

        datasets: [{
            label: 'Durée de chanson moyenne (secondes)',
            data: data.map(row => row.duration),
            fill: false,
            borderColor: '#52F3FF',
            tension: 0.1,
            pointRadius: 2,
            pointHoverRadius: 8,
            pointBackgroundColor: '#52F3FF',
            pointHoverBackgroundColor: '#FFF',
            pointHoverBorderWidth: 0,
        }]
    }

    // Formate les secondes en "XmYYs"
    function formatSecondsToMinSec(s) {
        const n = Number(s) || 0;
        const total = Math.round(n);              // arrondit aux secondes entières
        const m = Math.floor(total / 60);
        const sec = String(total % 60).padStart(2, '0');
        return `${m}m${sec}s`;
    }

    const glowPlugin = {
        id: 'glowLine',
        afterDatasetsDraw(chart) {
            const {ctx} = chart;
            chart.data.datasets.forEach((dataset, idx) => {
                const meta = chart.getDatasetMeta(idx);
                if (!meta || !meta.dataset) return;
                ctx.save();
                ctx.shadowColor = '#00E5FF';
                ctx.shadowBlur = 28;
                meta.dataset.draw(ctx);
                ctx.restore();
            });
        }
    };

    const config = {
        type: type,
        data: chartData,
        options: {
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.05)', // couleur des lignes verticales
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.6)',
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.05)', // couleur des lignes horizontales
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.6)',
                        callback: function(value) {
                            return formatSecondsToMinSec(value);
                        },
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: '#252527',
                    titleColor: '#FFF',
                    bodyColor: '#FFF',
                    padding: 8,
                    displayColors: false,
                    bodyFont: {
                        size: 14,
                    },
                    callbacks: {
                        title: (items) => items.length ? String(items[0].label) : '',
                        label: (ctx) => formatSecondsToMinSec(ctx.raw)
                    }
                }
            },

            // Making the chart responsive.
            responsive: true,
            maintainAspectRatio: false,
        },
        plugins: [glowPlugin],
    }

    myChart = new Chart(ctx, config);
}
