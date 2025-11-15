const featuringDiv = document.getElementById("featuring");

const canvas = document.createElement("canvas");
canvas.id = "featuringChart";
canvas.style.width = '100%';
canvas.style.height = '400px'; 
featuringDiv.appendChild(canvas);

fetch('./data/feat.json')
  .then(response => response.json())
  .then(data => {
    const years = data.map(d => d["Année"]);
    const totalFeaturing = data.map(d => d["Total des featurings"]);

    const ctx = canvas.getContext("2d");

    const rectHeight = 50;
    const gap = 5;
    const displayHeight = rectHeight - gap;

    const maxVal = Math.max(...totalFeaturing);
    const numRects = Math.ceil(maxVal / rectHeight);

    const colorSegments = [
      { maxVal: 200, color: 'rgba(255, 255, 255, 0.8)' },
      { maxVal: 350, color: 'rgba(255, 255, 255, 0.8)' },
      { maxVal: maxVal + rectHeight, color: 'rgba(255, 255, 255, 0.8)' }
    ];

    const datasets = [];
    for (let i = 0; i < numRects; i++) {
      const blockStartValue = i * rectHeight;
      let color = colorSegments[2].color;
      if (blockStartValue < colorSegments[0].maxVal) color = colorSegments[0].color;
      else if (blockStartValue < colorSegments[1].maxVal) color = colorSegments[1].color;

      datasets.push({
        label: `rect-${i}`,
        data: totalFeaturing.map(val => (val > blockStartValue ? displayHeight : 0)),
        backgroundColor: color,
        borderWidth: 2,
        borderSkipped: false,
        borderRadius: 0,
      });
    }
const glowBars = {
  id: 'glowBars',
  beforeDatasetDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(255,255,255,0.8)'; // glow blanc néon
    ctx.shadowBlur = 40;                        // intensité glow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  },
  afterDatasetDraw(chart) {
    chart.ctx.restore(); // stop glow pour le reste (axes, labels)
  }
};

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            enabled: true,
            callbacks: {
              title: (context) => ` ${years[context[0].dataIndex]}`,
              label: (context) => `Total de featurings : ${totalFeaturing[context.dataIndex]}`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            categoryPercentage: 0.8,
            barPercentage: 0.9
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: maxVal + rectHeight,
            grid: { display: false }
          }
        }
      },
      plugins: [glowBars]
    });
  })
  .catch(error => console.error(error));
