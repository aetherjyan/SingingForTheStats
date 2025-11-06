let tiktokCtx = document.getElementById("tiktok").getContext("2d");
let TikTokChart;

// Charger le JSON
fetch("./data/tiktokdata.json")
  .then((response) => {
    if (!response.ok) throw new Error("Erreur de chargement JSON");
    return response.json();
  })
  .then((data) => {
    console.log("Données JSON chargées :", data);
    createChart(data);
  })
  .catch((error) => console.error(error));

// === Création du graphique Doughnut ===
function createChart(data) {
  // 🧹 Si un graphique existe déjà, on le détruit pour éviter l’erreur “Canvas in use”
  if (TikTokChart) {
    TikTokChart.destroy();
  }

  const labels = data.map((row) => row.description);
  const values = data.map((row) => row.quota);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Impact TikTok",
        data: values,
        backgroundColor: [
          "#FF5CF1", // rose
          "#00E5FF", // cyan
          "#FFD166", // jaune
          "#6C63FF"  // violet
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 20,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#fff",
            font: {
              family: "'Unbounded', sans-serif",
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.label}: ${context.parsed}%`,
          },
        },
      },
    },
  };

  TikTokChart = new Chart(tiktokCtx, config);
}
