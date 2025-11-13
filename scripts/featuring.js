const featuringDiv = document.getElementById("featuring");
const canvas = document.createElement("canvas");
canvas.id = "featuringChart";
featuringDiv.appendChild(canvas);

fetch('./data/feat.json')
  .then(response => response.json())
  .then(data => {
    const years = data.map(d => d["Année"]);
    const totalFeaturing = data.map(d => d["Total des featurings"]);

    const ctx = document.getElementById("featuringChart").getContext("2d");

    // --- Paramètres des blocs ---
    const rectHeight = 50;
    const gap = 5;
    const displayHeight = rectHeight - gap;

    const maxVal = Math.max(...totalFeaturing);
    const numRects = Math.ceil(maxVal / rectHeight);

    // --- Tranches de couleur ---
    const colorSegments = [
      { maxVal: 200, color: 'rgba(102, 187, 106, 0.9)' }, // Vert
      { maxVal: 350, color: 'rgba(255, 238, 88, 0.9)' },  // Jaune
      { maxVal: maxVal + rectHeight, color: 'rgba(54, 162, 235, 0.9)' } // Bleu/Orange
    ];

    // --- Création des datasets par bloc ---
    const datasets = [];
    for (let i = 0; i < numRects; i++) {
      const blockStartValue = i * rectHeight;

      // Déterminer la couleur du bloc selon la tranche
      let color = colorSegments[2].color; // Couleur par défaut
      if (blockStartValue < colorSegments[0].maxVal) color = colorSegments[0].color;
      else if (blockStartValue < colorSegments[1].maxVal) color = colorSegments[1].color;

      datasets.push({
        label: `rect-${i}`,
        data: totalFeaturing.map(val => (val > blockStartValue ? displayHeight : 0)),
        backgroundColor: color,
        borderRadius: 0,
        borderSkipped: false,
        borderWidth: 0
      });
    }

    // --- Création du chart ---
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              // Affiche uniquement le total pour chaque colonne
              label: (context) => {
                if (context.datasetIndex === datasets.length - 1) {
                  return `Total: ${totalFeaturing[context.dataIndex]}`;
                }
                return '';
              },
              title: (context) => `Année ${years[context[0].dataIndex]}`
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
      }
    });
  })
  .catch(error => console.error(error));
