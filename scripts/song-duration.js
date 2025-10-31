/*Chapter 1 - Chart*/
let ctx = document.getElementById('song-duration').getContext('2d');

let myChart;
let JSONdata;

fetch("./data/duration_evolution.json")
    .then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        throw new Error('Failed to load data');
    })
    .then(function (data) {
        JSONdata = data;
        createChart(JSONdata, 'line');
        initYearSlider(JSONdata); // initialiser le slider après création du chart
    });


function createChart(data, type) {

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

    const chartData = {
        labels: data.map(row => row.year),

        datasets: [{
            label: 'Durée de chanson moyenne (secondes)',
            data: data.map(row => row.duration),
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
            const {ctx} = chart;
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

    // keep y scale fixed to full dataset so updates don't re-scale
    const durations = data.map(d => d.duration);
    const yMin = Math.floor(Math.min(...durations) - 5);
    const yMax = Math.ceil(Math.max(...durations) + 5);

    const config = {
        type: type,
        data: chartData,
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
                            size: 12,
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
                        callback: function(value) {
                            return formatSecondsToMinSec(value);
                        },
                        font: {
                            family: css.DisplayFont,
                            size: 12,
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

    myChart = new Chart(ctx, config);
}

// show tooltip on a specific datapoint for a short time
function showTemporaryTooltip(index, ms = 2000) {
    if (!myChart) return;
    const meta = myChart.getDatasetMeta(0);
    const el = meta && meta.data && meta.data[index];
    if (!el) return;

    // set active element & tooltip at the point coordinates
    myChart.setActiveElements([{ datasetIndex: 0, index }]);
    myChart.tooltip.setActiveElements([{ datasetIndex: 0, index }], { x: el.x, y: el.y });
    myChart.update();

    // clear after ms
    setTimeout(() => {
        myChart.setActiveElements([]);
        myChart.tooltip.setActiveElements([], { x: 0, y: 0 });
        myChart.update();
    }, ms);
}

// update chart without changing axes/labels: keep full labels, null-out future points
function updateChartToIndex(index) {
    if (!myChart || !JSONdata) return;

    // keep labels as full-year list so x-axis doesn't change
    myChart.data.labels = JSONdata.map(r => r.year);

    // show values up to index, hide later ones with null (keeps axis unchanged)
    myChart.data.datasets[0].data = JSONdata.map((r, i) => (i <= index ? Math.round(r.duration) : null));

    myChart.update();

    // show tooltip on the most recent visible point
    showTemporaryTooltip(index, 2000);
}

// initialise le slider DOM et ses events
function initYearSlider(data) {
    const slider = document.getElementById('year-slider');
    const label = document.getElementById('current-year');
    const rail = slider?.parentElement;
    if (!slider || !label || !rail) return;

    rail.style.position = rail.style.position || 'relative';
    label.style.position = 'absolute';
    // remove the broken calc; we'll compute left dynamically:
    // label.style.left = 'calc(100% + -48px)';

    const maxIndex = Math.max(0, data.length - 1);
    slider.min = 0;
    slider.max = maxIndex;
    slider.step = 1;

    const thumbHraw = getComputedStyle(document.documentElement).getPropertyValue('--thumb-h') || '34px';
    const thumbH = parseFloat(thumbHraw);

    function layoutSlider() {
        const railStyle = getComputedStyle(rail);
        const paddingTop = parseFloat(railStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(railStyle.paddingBottom) || 0;

        // set slider width to match usable vertical length
        const usable = rail.clientHeight - paddingTop - paddingBottom;
        const sliderWidth = Math.max(usable - 8, 80);
        slider.style.width = `${sliderWidth}px`;

        // remove horizontal JS placement — label stays anchored by CSS to rail center
        // positionElements();  <-- keep vertical positioning only
        positionElements();
    }

    slider.value = maxIndex;
    const initialIndex = maxIndex - Number(slider.value);
    label.textContent = data[initialIndex].year;
    updateChartToIndex(initialIndex);

    function positionElements() {
        const min = Number(slider.min);
        const max = Number(slider.max);
        const val = Number(slider.value);
        const pct = (max === min) ? 0 : (val - min) / (max - min);
        const visualPct = 1 - pct;

        const railStyle = getComputedStyle(rail);
        const paddingTop = parseFloat(railStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(railStyle.paddingBottom) || 0;
        const available = rail.clientHeight - paddingTop - paddingBottom - thumbH;
        const base = paddingTop + (thumbH / 2);

        // vertical center on thumb
        const y = base + visualPct * available;
        label.style.top = `${y}px`;
    }

    requestAnimationFrame(layoutSlider);

    slider.addEventListener('input', (e) => {
        const visualValue = Number(e.target.value);
        const idx = maxIndex - visualValue;
        label.textContent = data[idx].year;
        updateChartToIndex(idx);
        requestAnimationFrame(positionElements);
    });

    window.addEventListener('resize', () => requestAnimationFrame(layoutSlider));
    window.addEventListener('load', () => requestAnimationFrame(layoutSlider));
}
