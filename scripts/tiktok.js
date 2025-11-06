/*Chapter 1 - Chart*/
let tiktokCtx = document.getElementById('tiktok').getContext('2d');

let TikTokChart;
let TikTokJSONdata;

fetch("./data/tiktokdata.json")
    .then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        throw new Error('Failed to load data');
    })
    .then(function (data) {
        TikTokJSONdata = data;
        createChart(TikTokJSONdata, 'doughnut');
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
        labels: data.map(row => row.description),

        datasets: [{
            data: data.map(row => row.quota),
        }]
    }

    const config = {
        type: type,
        data: chartData,
        options: {

            // Making the chart responsive.
            responsive: true,
            maintainAspectRatio: false,
        },
    }

    TikTokChart = new Chart(tiktokCtx, config);
}

