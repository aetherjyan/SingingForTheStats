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
const captionStatic = document.querySelector(".caption-static");
const captionDynamic = document.querySelector(".caption-dynamic");

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
        White12: getCssVar('--White-12', 'rgba(255,255,255,0.12)'),
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

    // Fonction pour obtenir la couleur d'un segment
    function getSegmentColor(ctx) {
        if (ctx.type !== 'data') {
            return;
        }
        // Dans le gauge, index 0 = valeur sélectionnée, index 1 = reste
        if (ctx.index === 0) {
            // Utiliser la couleur du segment sélectionné basé sur highlightedSegmentIndex
            const colorIndex = highlightedSegmentIndex >= 0 ? highlightedSegmentIndex : 0;
            return colors[colorIndex];
        }
        // Index 1 = reste, toujours gris clair
        return css.White12;
    }

    // Initialiser avec la première donnée pour créer le gauge
    const initialDataId = dataMap[currentDataIndex];
    const initialSegmentIndex = data.findIndex(item => item.id === initialDataId);
    const initialValue = initialSegmentIndex !== -1 ? data[initialSegmentIndex].quota : data[0].quota;
    const total = 100; // Total pour le gauge (100%)

    const tiktokChartData = {
        labels: data.map(row => row.description),
        datasets: [{
            label: 'Répartition des types de buzz du Billboard Global 200 (2024)',
            data: [initialValue, total - initialValue], // [valeur sélectionnée, reste]
            backgroundColor: function(ctx) {
                return getSegmentColor(ctx);
            },
            borderWidth: 0,
            circumference: 180,
            rotation: -90,
            cutout: '75%',
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
            
            // Dans le gauge, le segment sélectionné est toujours à l'index 0
            const segment = meta.data[0];
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

    // Annotation pour afficher le contenu au centre (style gauge)
    const annotation = {
        type: 'doughnutLabel',
        content: ({chart}) => {
            const currentData = tiktokData[highlightedSegmentIndex >= 0 ? highlightedSegmentIndex : 0];
            if (!currentData) return ['', ''];
            return [
                String(currentData.quota).padStart(2, '0') + ' %',
                currentData.description
            ];
        },
        drawTime: 'beforeDraw',
        position: {
            y: '-50%'
        },
        font: [
            {size: 50, weight: 'bold', family: 'Unbounded, sans-serif'},
            {size: 16, family: 'Geist Mono, monospace'}
        ],
        color: ({chart}) => {
            const currentData = tiktokData[highlightedSegmentIndex >= 0 ? highlightedSegmentIndex : 0];
            if (!currentData) return ['#fff', '#fff'];
            const segmentIndex = tiktokData.findIndex(item => item.id === currentData.id);
            return [colors[segmentIndex] || '#fff', '#fff'];
        }
    };

    // config 
    const config = {
        type: type,
        data: tiktokChartData,
        plugins: {
            glowPlugin: glowPlugin,
            annotation: {
                annotations: {
                    annotation
                }
            }
        },
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

// Fonction pour positionner le bouton en bas et au centre du conteneur
function positionButtonAtCenter() {
    if (!chartSwitchButton) return;
    
    // Le CSS gère déjà le positionnement (bottom: 0, left: 50%, transform: translateX(-50%))
    // On s'assure juste que le transform pour la rotation de l'image ne soit pas écrasé
    const container = chartSwitchButton.closest('.chart-container');
    if (container) {
        // Le transform CSS pour le centrage horizontal est déjà défini dans le CSS
        // On ne modifie que la rotation de l'image, pas le positionnement du bouton
    }
}

// Fonction pour mettre à jour la figcaption
function updateCaption(segmentIndex) {
    if (!tiktokData || segmentIndex < 0 || segmentIndex >= tiktokData.length) return;
    
    const currentData = tiktokData[segmentIndex];
    
    if (currentData && captionQuota) {
        captionQuota.textContent = `${String(currentData.quota).padStart(2, '0')} %`;
        
        // Séparer "des musiques" du reste de la description
        const description = currentData.description;
        const staticText = "des musiques";
        let dynamicText = description;
        
        // Extraire la partie dynamique (ce qui vient après "des musiques")
        if (description.startsWith(staticText)) {
            dynamicText = description.substring(staticText.length).trim();
        }
        
        // Mettre à jour les éléments séparés
        if (captionStatic) {
            captionStatic.textContent = staticText;
        }
        if (captionDynamic) {
            captionDynamic.textContent = dynamicText;
        }
    }
}

// Fonction pour mettre à jour le graphique et l'image
function updateChartHighlight(segmentIndex) {
    if (!TikTokChart || !tiktokData || segmentIndex < 0 || segmentIndex >= tiktokData.length) return;
    
    // Mettre à jour l'index du segment mis en évidence
    highlightedSegmentIndex = segmentIndex;
    
    // Obtenir la valeur du segment sélectionné
    const selectedData = tiktokData[segmentIndex];
    const value = selectedData.quota;
    const total = 100;
    
    // Mettre à jour les données du graphique (style gauge)
    TikTokChart.data.datasets[0].data = [value, total - value];
    
    // Forcer la mise à jour des couleurs en recréant la fonction backgroundColor
    const getCssVar = (name, fallback = '') => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name);
        return v ? v.trim() : fallback;
    };
    const css = {
        Cyan: getCssVar('--Cyan', '#00E5FF'),
        Pink: getCssVar('--Pink', '#FF5CF1'),
        White12: getCssVar('--White-12', 'rgba(255,255,255,0.12)'),
    };
    const colors = ['#FFFFFF', css.Cyan, css.Pink];
    
    TikTokChart.data.datasets[0].backgroundColor = function(ctx) {
        if (ctx.type !== 'data') {
            return;
        }
        // Dans le gauge, index 0 = valeur sélectionnée, index 1 = reste
        if (ctx.index === 0) {
            return colors[segmentIndex];
        }
        return css.White12;
    };
    
    // Redessiner le graphique pour appliquer le glow et l'annotation
    TikTokChart.update();
    
    // Obtenir l'angle du segment directement depuis Chart.js
    // Dans le gauge, le segment sélectionné est toujours à l'index 0
    const meta = TikTokChart.getDatasetMeta(0);
    const segment = meta.data[0]; // Toujours le premier segment dans le gauge
    
    if (segment && scrollWheelImg) {
        // Mapping direct entre les valeurs et les angles (0° = scroll-wheel pointant vers le bas)
        const angleMap = {
            4: 96,   // 4% → 96°
            12: 112, // 12% → 112°
            84: 240  // 84% → 240°
        };
        
        // Obtenir l'angle cible depuis le mapping
        const selectedData = tiktokData[segmentIndex];
        let targetAngleDeg = angleMap[selectedData.quota];
        
        // Si l'angle n'est pas dans le mapping, calculer depuis l'extrémité du segment
        if (targetAngleDeg === undefined) {
            const { x, y, outerRadius, endAngle } = segment;
            const endX = x + Math.cos(endAngle) * outerRadius;
            const endY = y + Math.sin(endAngle) * outerRadius;
            const angleRad = Math.atan2(endY - y, endX - x);
            targetAngleDeg = (angleRad * 180) / Math.PI + 90;
            targetAngleDeg = ((targetAngleDeg % 360) + 360) % 360;
        }
        
        // Calculer la rotation nécessaire pour aller de la position actuelle à la cible
        // Calculer l'angle actuel normalisé
        const currentAngle = cumulativeRotation % 360;
        let rotationNeeded = targetAngleDeg - currentAngle;
        
        // Choisir le chemin le plus court (peut être dans le sens horaire ou antihoraire)
        if (rotationNeeded > 180) {
            rotationNeeded -= 360;
        } else if (rotationNeeded < -180) {
            rotationNeeded += 360;
        }
        
        // Ajouter la rotation nécessaire à la rotation cumulative
        cumulativeRotation += rotationNeeded;
        
        // Appliquer la rotation à l'image (pas au bouton)
        // Le bouton est positionné en bas et au centre via CSS, on ne touche pas à son transform
        scrollWheelImg.style.transform = `rotate(${cumulativeRotation}deg)`;
        scrollWheelImg.style.transition = 'transform 0.5s ease';
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