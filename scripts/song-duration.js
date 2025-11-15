/*Chapter 1 - Chart*/
let ctx = document.getElementById('song-duration').getContext('2d');

let yearSlider = document.querySelector(".year-slider"); 

let DurationChart;
let DurationJsonData;

fetch("./data/duration_evolution.json")
    .then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        throw new Error('Failed to load data');
    })
    .then(function (data) {
        DurationJsonData = data;
        createSongDurationChart(DurationJsonData, 'line');
    });


function createSongDurationChart(data, type) {

    const getCssVar = (name, fallback = '') => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name);
        return v ? v.trim() : fallback;
    };

    const css = {
        LightCyan: getCssVar('--Light-Cyan', '#52F3FF'),
        Cyan: getCssVar('--Cyan', '#00E5FF'),
        Cyan20: getCssVar('--Cyan-20', 'rgba(0,238,255,0.20)'),
        DarkCyan: getCssVar('--Dark-Cyan', '#335B68'),
        DarkCyan50: getCssVar('--Dark-Cyan-50', '#335b6880'),
        Pink: getCssVar('--Pink', '#FF5CF1'),
        LightPink: getCssVar('--Light-Pink', '#FF7DF4'),

        White5: getCssVar('--White-5', 'rgba(255,255,255,0.05)'),
        Black: getCssVar('--Black', '#23232a'),
        Black50: getCssVar('--Black-50', 'rgba(31,31,38,0.5)'),
        Black25: getCssVar('--Black-25', 'rgba(31,31,38,0.25)'),
        DarkGrey: getCssVar('--Dark-Grey', '#4f525d'),
        Grey: getCssVar('--Grey', '#666979'),
        MidGrey: getCssVar('--Mid-Grey', '#6c707f'),
        LightGrey: getCssVar('--Light-Grey', '#84889b'),
        SuperLightGrey: getCssVar('--Super-Light-Grey', '#dfe0e2'),

        GridMargin: getCssVar('--Grid-Margin', '8rem'),
        GridGutter: getCssVar('--Grid-Gutter', '2.5rem'),

        HeadingFont: getCssVar('--Heading-Font', "'Unbounded', sans-serif"),
        BodyFont: getCssVar('--Body-Font', "'Vercetti', sans-serif"),
        DisplayFont: getCssVar('--Display-Font', "'Geist Mono', 'Vercetti', monospace")
    };

    const songDurationChartData = {
        labels: data.map(row => row.year),

        datasets: [{
            label: 'Durée de chanson moyenne (secondes)',
            data: data.map((row, i) => i === 0 ? row.duration : null),
            fill: false,
            borderColor: css.LightCyan,
            tension: 0.1,
            pointRadius: 2,
            pointHoverRadius: 8,
            pointBackgroundColor: css.LightCyan,
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
            const { ctx } = chart;
            chart.data.datasets.forEach((dataset, idx) => {
                const meta = chart.getDatasetMeta(idx);
                if (!meta || !meta.dataset) return;
                ctx.save();
                ctx.shadowColor = css.Cyan;
                ctx.shadowBlur = 28;
                meta.dataset.draw(ctx);
                ctx.restore();
            });
        }
    };

    const durations = data.map(d => d.duration);
    const yMin = Math.floor(Math.min(...durations) - 5);
    const yMax = Math.ceil(Math.max(...durations) + 5);

    const config = {
        type: type,
        data: songDurationChartData,
        options: {
            scales: {
                x: {
                    grid: {
                        color: css.White5,
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false
                    },
                    ticks: {
                        color: css.Grey,
                        font: {
                            family: css.DisplayFont,
                            size: 14,
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    min: yMin,           // fixed min
                    max: yMax,           // fixed max
                    grid: {
                        color: css.White5,
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false
                    },
                    ticks: {
                        color: css.Grey,
                        callback: function (value) {
                            return formatSecondsToMinSec(value);
                        },
                        font: {
                            family: css.DisplayFont,
                            size: 14,
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 16,
                    right: 24,
                    top: 24,
                    bottom: 16,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: css.Black,
                    titleColor: css.SuperLightGrey,
                    bodyColor: '#FFF',
                    padding: 8,
                    cornerRadius: 4,
                    yAlign: "bottom",
                    displayColors: false,
                    titleAlign: 'center',
                    bodyAlign: 'center',
                    titleMarginBottom: 0,
                    titleFont: {
                        size: 12,
                        fontFamily: css.BodyFont,
                        weight: '400',
                    },
                    bodyFont: {
                        size: 16,
                        fontFamily: css.DisplayFont,
                        weight: '600',
                    },
                    callbacks: {
                        title: (items) => items.length ? String(items[0].label) : '',
                        label: (ctx) => formatSecondsToMinSec(ctx.raw)
                    },
                    borderColor: css.White5,
                    borderWidth: 1,
                }
            },

            // Making the chart responsive.
            responsive: true,
            maintainAspectRatio: false,
        },
        plugins: [glowPlugin],
    }

    DurationChart = new Chart(ctx, config);
}

// Controleur

function updateChartLine(index) {
    const fullData = DurationJsonData.map(d => d.duration);
    DurationChart.data.datasets[0].data = fullData.map((val, i) => (i <= index ? val : null));
    DurationChart.update();
}
yearSlider.addEventListener('input', function (e) {
    const index = +e.target.value;
    updateChartLine(index);
});



