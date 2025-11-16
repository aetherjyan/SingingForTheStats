// Graphique en barres simple avec Chart.js
const canvas = document.getElementById("featuring");

// Fonction pour obtenir les variables CSS
const getCssVar = (name, fallback = '') => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return v ? v.trim() : fallback;
};

const css = {
  LightCyan: getCssVar('--Light-Cyan', '#52F3FF'),
  DarkCyan: getCssVar('--Dark-Cyan', '#335B68'),
  White: getCssVar('--White', '#FFFFFF'),
  White5: getCssVar('--White-5', 'rgba(255,255,255,0.05)'),
  White25: getCssVar('--White-25', 'rgba(255,255,255,0.25)'),
  White50: getCssVar('--White-50', 'rgba(255,255,255,0.50)'),
  Black: getCssVar('--Black', '#23232a'),
  SuperLightGrey: getCssVar('--Super-Light-Grey', '#dfe0e2'),
  Pink: getCssVar('--Pink', '#FF5CF1'),
  Pink50: getCssVar('--Pink-50', 'rgba(255,92,241,0.5)'),
  Pink25: getCssVar('--Pink-25', 'rgba(255,92,241,0.25)'),
  LightPink: getCssVar('--Light-Pink', '#FF7DF4'),
  SuperLightPink: getCssVar('--Super-Light-Pink', '#ffb0f8'),
  BodyFont: getCssVar('--Body-Font', "'Vercetti', sans-serif"),
  DisplayFont: getCssVar('--Display-Font', "'Geist Mono', 'Vercetti', monospace")
};

// Charger les données et créer le graphique
fetch('./data/feat.json')
  .then(response => response.json())
  .then(data => {
    const years = data.map(d => d["Année"]);
    const values = data.map(d => d["Total des featurings"]);

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    // Variable pour suivre si l'animation a été déclenchée
    let animationTriggered = false;

    // Plugin pour dessiner les barres avec gradient individuel et glow
    const gradientPlugin = {
      id: 'gradientBars',
      afterDatasetsDraw: (chart) => {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const meta = chart.getDatasetMeta(0);

        // Dessiner chaque barre avec son propre gradient et glow
        meta.data.forEach((element) => {
          if (!element || typeof element.x !== 'number' || typeof element.y !== 'number') return;

          const { x, y, base, width } = element;

          ctx.save();

          // Appliquer le glow (comme dans le chapitre 1)
          ctx.shadowColor = css.Pink50;
          ctx.shadowBlur = 28;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Créer un gradient vertical pour cette barre spécifique (du haut au bas de la barre)
          const gradient = ctx.createLinearGradient(x - width / 2, y, x - width / 2, base);
          gradient.addColorStop(0, css.White); // Blanc en haut de la barre
          gradient.addColorStop(1, css.Pink25); // Rose en bas de la barre

          // Dessiner la barre arrondie avec le gradient et le glow
          const radius = 2;
          ctx.beginPath();
          ctx.roundRect(x - width / 2, y, width, base - y, radius);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.restore();
        });
      }
    };

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Total des featurings',
          data: values,
          backgroundColor: 'transparent', // Transparent car le plugin dessine les barres
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 2,
          categoryPercentage: 1,
          barPercentage: .9,
        }]
      },
      plugins: [gradientPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          // Désactiver l'animation initiale, elle sera activée via Intersection Observer
          duration: 0,
          delay: () => 0,
          onComplete: () => {
            animationTriggered = true;
          }
        },
        transitions: {
          active: { animation: { duration: 0 } },
          hover: { animation: { duration: 0 } }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
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
            borderColor: css.White5,
            borderWidth: 1,
            animation: false,
            callbacks: {
              title: (tooltipItems) => {
                if (tooltipItems.length > 0) {
                  return String(tooltipItems[0].label);
                }
                return '';
              },
              label: (tooltipItem) => {
                return `Total de featurings : ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              color: css.White5,
              width: 1
            },
            ticks: {
              color: css.White50,
              font: {
                family: css.DisplayFont,
                size: 14,
              }
            },
            grid: {
              color: css.White5,
              drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            border: {
              color: css.White5,
              width: 1
            },
            ticks: {
              color: css.White50,
              font: {
                family: css.DisplayFont,
                size: 14,
              }
            },
            grid: {
              color: css.White5,
              drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false
            },
          }
        }
      }
    });

    // Fonction pour déclencher l'animation avec stagger
    const triggerAnimation = () => {
      if (animationTriggered) return; // Ne déclencher qu'une seule fois

      // Mettre à jour les options d'animation avec delay/stagger
      chart.options.animation = {
        duration: 800,
        easing: 'easeOutQuart',
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !animationTriggered) {
            delay = context.dataIndex * 80; // Stagger de 80ms entre chaque barre
          }
          return delay;
        },
        onComplete: () => {
          animationTriggered = true;
        }
      };

      // Réinitialiser les données à 0 pour l'animation
      const originalData = [...values];
      const meta = chart.getDatasetMeta(0);

      // Réinitialiser chaque barre individuellement
      meta.data.forEach((element, index) => {
        if (element) {
          element.y = element.base; // Positionner en bas pour l'animation vers le haut
        }
      });

      // Réinitialiser les données du dataset
      chart.data.datasets[0].data = new Array(values.length).fill(0);
      chart.update('none'); // Mise à jour sans animation

      // Restaurer les données originales et déclencher l'animation
      chart.data.datasets[0].data = originalData;
      chart.update('active'); // Mise à jour avec animation
    };

    // Intersection Observer pour détecter quand le graphique est dans le viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
          triggerAnimation();
          observer.unobserve(entry.target); // Arrêter d'observer après l'animation
        }
      });
    }, {
      threshold: 0.2 // Déclencher quand 20% du graphique est visible
    });

    // Observer le conteneur du canvas
    const chartContainer = canvas.closest('.chart-window') || canvas.parentElement;
    if (chartContainer) {
      observer.observe(chartContainer);
    }
  })
  .catch(error => console.error('Erreur lors du chargement des données:', error));
