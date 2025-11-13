let tiktokCtx = document.getElementById("tiktok").getContext("2d");
let TikTokChart;
let tiktokData = [];
// Index pour suivre l'état actuel (0: Initial, 1: 84%, 2: 12%, 3: 4%)
let currentDataIndex = 0; 
// L'ordre dans lequel on utilise les IDs du JSON
const dataMap = [1, 2, 3, 4]; 

// Récupération des éléments HTML à mettre à jour
const tiktokButton = document.getElementById("tiktok-button");
const captionQuota = document.getElementById("caption-quota");
const captionDescription = document.getElementById("caption-description");

// Charger le JSON
fetch("./data/tiktokdata.json")
  .then((response) => {
    if (!response.ok) throw new Error("Erreur de chargement JSON");
    return response.json();
  })
  .then((data) => {
    tiktokData = data;
    // Crée le graphique initial (ID 1)
    updateChart(); 
    // Ajoute l'écouteur d'événement
    tiktokButton.addEventListener("click", handleButtonClick);
  })
  .catch((error) => console.error(error));

// === Logique de mise à jour au clic ===
function handleButtonClick() {
    // Si nous sommes à l'état initial (ID 1, index 0), on passe à l'ID 2 (index 1)
    if (currentDataIndex === 0) {
        currentDataIndex = 1;
    } 
    // Si nous sommes à l'état ID 4 (index 3), on boucle vers l'ID 2 (index 1)
    else if (currentDataIndex === 3) {
        currentDataIndex = 1; 
    } 
    // Sinon, on passe simplement à l'état suivant (ID 2 -> 3)
    else {
        currentDataIndex++;
    }
    
    updateChart();
}

// === Création/Mise à jour du graphique Doughnut ===
function updateChart() {
    const targetId = dataMap[currentDataIndex];
    const targetData = tiktokData.find(row => row.id === targetId);

    if (!targetData) return;

    const currentQuota = targetData.quota; 
    
    // Déterminer les valeurs à afficher dans le graphique
    let displayQuota;
    let displayRemaining;
    let activeColor;

    if (targetId === 1) {
        // État initial (ID 1: "Appuyer sur la molette")
        displayQuota = 0.0001; // Éviter 0 pour que Chart.js ne l'ignore pas
        displayRemaining = 100;
        activeColor = "#d3d3d3"; // Gris clair
        tiktokButton.style.display = 'block'; // Rendre le bouton visible
    } else {
        // États 2, 3, 4
        displayQuota = currentQuota;
        displayRemaining = 100 - currentQuota;
        tiktokButton.style.display = 'block'; // Le bouton reste visible

        // Détermine la couleur de la section de donnée
        if (targetId === 2) activeColor = "#00E5FF"; // Cyan pour 84%
        else if (targetId === 3) activeColor = "#FF5CF1"; // Rose pour 12%
        else if (targetId === 4) activeColor = "#6C63FF"; // Violet pour 4%
    }
    
    // 1. Mise à jour des éléments HTML sous le graphique
    captionQuota.textContent = targetId === 1 ? "" : `${currentQuota} %`;
    captionDescription.textContent = targetData.description;
    
    // Masquer le pourcentage pour le texte initial si besoin, ou utiliser CSS
    if (targetId === 1) {
        captionQuota.style.display = 'none';
        captionDescription.style.fontSize = '36px'; // Agrandir le texte initial pour l'effet
    } else {
        captionQuota.style.display = 'block';
        captionDescription.style.fontSize = '16px';
    }


    // 2. Mise à jour/Recréation du graphique
    if (TikTokChart) {
        TikTokChart.destroy();
    }

    const chartData = {
        labels: [targetData.description, "Reste du cercle"], 
        datasets: [
            {
                label: "Impact TikTok",
                data: [displayQuota, displayRemaining],
                backgroundColor: [
                    activeColor, // Couleur du quota actif
                    "#d3d3d3"   // Couleur de la partie restante (gris clair)
                ],
                borderWidth: 2,
                borderColor: "#ffffff",
                hoverOffset: 0,
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
                legend: { display: false },
                tooltip: { enabled: false },
            },
        },
    };

    TikTokChart = new Chart(tiktokCtx, config);
}