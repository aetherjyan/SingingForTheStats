let tiktokCtx = document.getElementById("tiktok").getContext("2d");
let TikTokChart;
let tiktokData = [];
// Index pour suivre l'état actuel (0: 4%, 1: 12%, 2: 84%)
let currentDataIndex = 0;
// L'ordre dans lequel on utilise les IDs du JSON
const dataMap = [1, 2, 3];
// Index du segment actuellement mis en évidence
let highlightedSegmentIndex = -1;
// Rotation cumulative de la molette (toujours dans le sens horaire)
let cumulativeRotation = 0;

// Récupération des éléments HTML à mettre à jour
const chartSwitchButton = document.querySelector(".chart-switch");
const scrollWheelImg = document.querySelector(".chart-switch .scroll-wheel");
const captionQuota = document.querySelector(".caption-quota");
const captionDescription = document.querySelector(".caption-description");

// Charger le JSON
fetch("./data/tiktokdata.json")
    .then((response) => {
        if (!response.ok) throw new Error("Erreur de chargement JSON");
        return response.json();
    })
    .then((data) => {
        tiktokData = data;
        createTiktokChart(tiktokData, 'doughnut');
        // Initialiser avec la première donnée (id 1, index 0)
        const initialDataId = dataMap[currentDataIndex];
        const initialSegmentIndex = tiktokData.findIndex(item => item.id === initialDataId);
        if (initialSegmentIndex !== -1) {
            updateChartHighlight(initialSegmentIndex);
        }
        // Ajouter le gestionnaire d'événement au bouton
        if (chartSwitchButton) {
            chartSwitchButton.addEventListener('click', handleChartSwitch);
        }
    })
    .catch((error) => console.error(error));

function createTiktokChart(data, type) {

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

    const colors = [
        '#FFFFFF',     // id 1: 4% - blanc
        css.Cyan,      // id 2: 12%
        css.Pink,      // id 3: 84%
    ];

    const tiktokChartData = {
        labels: data.map(row => row.description),
        datasets: [{
            label: 'Répartition des types de buzz du Billboard Global 200 (2024)',
            data: data.map(row => row.quota),
            backgroundColor: colors,
            borderWidth: 0,
            circumference: 180,
            rotation: -90,
            cutout: '80%',
            borderRadius: 8,
        }]
    };

    // Fonction pour dessiner un segment avec borderRadius
    function drawRoundedSegment(ctx, x, y, outerRadius, innerRadius, startAngle, endAngle, borderRadius) {
        const thickness = outerRadius - innerRadius;
        const cornerRadius = Math.min(borderRadius, thickness / 2);
        const midRadius = (outerRadius + innerRadius) / 2;
        
        // Calculer les angles ajustés pour les coins arrondis
        const angleOffset = Math.asin(cornerRadius / midRadius);
        const adjustedStartAngle = startAngle + angleOffset;
        const adjustedEndAngle = endAngle - angleOffset;
        
        // Points pour les coins arrondis
        const startCornerCenterX = x + Math.cos(startAngle) * midRadius;
        const startCornerCenterY = y + Math.sin(startAngle) * midRadius;
        const endCornerCenterX = x + Math.cos(endAngle) * midRadius;
        const endCornerCenterY = y + Math.sin(endAngle) * midRadius;
        
        const startArcOuterX = x + Math.cos(adjustedStartAngle) * outerRadius;
        const startArcOuterY = y + Math.sin(adjustedStartAngle) * outerRadius;
        const startArcInnerX = x + Math.cos(adjustedStartAngle) * innerRadius;
        const startArcInnerY = y + Math.sin(adjustedStartAngle) * innerRadius;
        
        const endArcOuterX = x + Math.cos(adjustedEndAngle) * outerRadius;
        const endArcOuterY = y + Math.sin(adjustedEndAngle) * outerRadius;
        const endArcInnerX = x + Math.cos(adjustedEndAngle) * innerRadius;
        const endArcInnerY = y + Math.sin(adjustedEndAngle) * innerRadius;
        
        ctx.beginPath();
        ctx.moveTo(startArcOuterX, startArcOuterY);
        
        // Arc extérieur principal
        ctx.arc(x, y, outerRadius, adjustedStartAngle, adjustedEndAngle);
        
        // Coin arrondi à la fin (extérieur -> intérieur)
        const endCornerStartAngle = Math.atan2(endArcOuterY - endCornerCenterY, endArcOuterX - endCornerCenterX);
        const endCornerEndAngle = Math.atan2(endArcInnerY - endCornerCenterY, endArcInnerX - endCornerCenterX);
        ctx.arc(endCornerCenterX, endCornerCenterY, cornerRadius, endCornerStartAngle, endCornerEndAngle);
        
        // Arc intérieur principal (sens inverse)
        ctx.arc(x, y, innerRadius, adjustedEndAngle, adjustedStartAngle, true);
        
        // Coin arrondi au début (intérieur -> extérieur)
        const startCornerStartAngle = Math.atan2(startArcInnerY - startCornerCenterY, startArcInnerX - startCornerCenterX);
        const startCornerEndAngle = Math.atan2(startArcOuterY - startCornerCenterY, startArcOuterX - startCornerCenterX);
        ctx.arc(startCornerCenterX, startCornerCenterY, cornerRadius, startCornerStartAngle, startCornerEndAngle);
        
        ctx.closePath();
    }

    // Plugin pour ajouter le glow autour du segment sélectionné
    const glowPlugin = {
        id: 'glowEffect',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            
            if (!meta || highlightedSegmentIndex === -1) return;
            
            const segment = meta.data[highlightedSegmentIndex];
            if (!segment || !segment.options) return;
            
            ctx.save();
            
            // Ne pas utiliser de clipping pour permettre au glow de dépasser
            // Le conteneur CSS gérera l'overflow
            
            // Obtenir les coordonnées du segment
            const { x, y, innerRadius, outerRadius, startAngle, endAngle } = segment;
            const segmentColor = segment.options.backgroundColor;
            
            // Configurer le glow
            ctx.shadowColor = segmentColor;
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Dessiner le segment avec borderRadius = 8
            drawRoundedSegment(ctx, x, y, outerRadius, innerRadius, startAngle, endAngle, 8);
            ctx.fillStyle = segmentColor;
            ctx.fill();
            
            // Réinitialiser
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            
            ctx.restore();
        }
    };

    // config 
    const config = {
        type: type,
        data: tiktokChartData,
        plugins: [glowPlugin],
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                }
            },
            aspectRatio: 2,
        },
        
    };

    // render init block
    TikTokChart = new Chart(
        tiktokCtx,
        config
    );
    
    // Positionner le bouton au centre du graphique après création
    positionButtonAtCenter();
}

// Fonction pour positionner le bouton au centre du canvas
function positionButtonAtCenter() {
    if (!TikTokChart || !chartSwitchButton) return;
    
    const canvas = TikTokChart.canvas;
    const chartArea = TikTokChart.chartArea;
    const canvasRect = canvas.getBoundingClientRect();
    const container = canvas.closest('.chart-container');
    
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculer le centre du graphique en coordonnées relatives au canvas
    const centerXCanvas = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerYCanvas = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
    
    // Convertir en coordonnées relatives au conteneur
    const centerX = centerXCanvas - (canvasRect.left - containerRect.left);
    const centerY = centerYCanvas - (canvasRect.top - containerRect.top);
    
    // Positionner le bouton au centre
    chartSwitchButton.style.position = 'absolute';
    chartSwitchButton.style.left = `${centerX}px`;
    chartSwitchButton.style.top = `${centerY}px`;
    chartSwitchButton.style.transform = 'translate(-50%, -50%)';
}

// Fonction pour mettre à jour la figcaption
function updateCaption(segmentIndex) {
    if (!tiktokData || segmentIndex < 0 || segmentIndex >= tiktokData.length) return;
    
    const currentData = tiktokData[segmentIndex];
    
    if (currentData && captionQuota && captionDescription) {
        captionQuota.textContent = `${String(currentData.quota).padStart(2, '0')} %`;
        captionDescription.textContent = currentData.description;
    }
}

// Fonction pour mettre à jour le graphique et l'image
function updateChartHighlight(segmentIndex) {
    if (!TikTokChart || !tiktokData || segmentIndex < 0 || segmentIndex >= tiktokData.length) return;
    
    // Mettre à jour l'index du segment mis en évidence
    highlightedSegmentIndex = segmentIndex;
    
    // Redessiner le graphique pour appliquer le glow
    TikTokChart.draw();
    
    // Obtenir l'angle du segment directement depuis Chart.js
    const meta = TikTokChart.getDatasetMeta(0);
    const segment = meta.data[segmentIndex];
    
    if (segment && scrollWheelImg) {
        // Calculer l'angle du milieu du segment (en radians)
        const middleAngleRad = (segment.startAngle + segment.endAngle) / 2;
        
        // Convertir en degrés CSS
        let targetAngleDeg = (middleAngleRad * 180) / Math.PI;
        
        // Ajuster pour que l'image pointe vers le segment (compenser l'orientation initiale)
        targetAngleDeg = targetAngleDeg - 90;
        
        // Normaliser l'angle entre 0 et 360
        targetAngleDeg = ((targetAngleDeg % 360) + 360) % 360;
        
        // Calculer la rotation nécessaire pour aller de la position actuelle à la cible
        // Toujours dans le sens horaire (rotation positive)
        let rotationNeeded = targetAngleDeg - (cumulativeRotation % 360);
        
        // Ajuster pour toujours tourner dans le sens horaire
        if (rotationNeeded < 0) {
            rotationNeeded += 360;
        }
        
        // Ajouter la rotation nécessaire à la rotation cumulative
        cumulativeRotation += rotationNeeded;
        
        // Appliquer la rotation à l'image (pas au bouton)
        scrollWheelImg.style.transform = `rotate(${cumulativeRotation}deg)`;
        scrollWheelImg.style.transition = 'transform 0.5s ease';
        
        // S'assurer que le bouton reste centré
        const container = chartSwitchButton.closest('.chart-container');
        if (container) {
            chartSwitchButton.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    // Mettre à jour la figcaption
    updateCaption(segmentIndex);
    
    // Repositionner le bouton au cas où le canvas a changé de taille
    positionButtonAtCenter();
}

// Gestionnaire d'événement pour le bouton
function handleChartSwitch() {
    // Passer à l'index suivant (cycle)
    currentDataIndex = (currentDataIndex + 1) % dataMap.length;
    
    // Trouver l'index dans tiktokData correspondant à l'ID dans dataMap
    const dataId = dataMap[currentDataIndex];
    const segmentIndex = tiktokData.findIndex(item => item.id === dataId);
    
    if (segmentIndex !== -1) {
        updateChartHighlight(segmentIndex);
    }
}