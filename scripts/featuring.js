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
          data: new Array(values.length).fill(0), // Commencer à 0 pour l'animation
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
          // Désactiver l'animation initiale, elle sera activée via ScrollTrigger
          duration: 0,
          delay: () => 0,
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
            min: 0,
            max: Math.max(...values) * 1.1, // Fixer le max à 110% de la valeur maximale pour un peu d'espace
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
    const triggerChartAnimation = () => {
      if (animationTriggered) return;
      animationTriggered = true;

      // Activer l'animation pour Chart.js
      chart.options.animation = {
        duration: 1200,
        easing: 'easeOutCubic',
      };

      // Créer un tableau de données animées (commence à 0)
      const animatedData = new Array(values.length).fill(0);
      chart.data.datasets[0].data = animatedData;
      chart.update('none');

      // Animer chaque barre individuellement avec GSAP
      if (typeof gsap !== 'undefined') {
        values.forEach((targetValue, index) => {
          // Créer un objet pour suivre la valeur animée
          const progress = { value: 0 };
          
          gsap.to(progress, {
            value: 1,
            duration: 1.2,
            delay: index * 0.08, // Stagger de 80ms entre chaque barre
            ease: "power2.out",
            onUpdate: () => {
              // Mettre à jour la valeur de cette barre spécifique
              animatedData[index] = targetValue * progress.value;
              chart.data.datasets[0].data = [...animatedData];
              chart.update('none'); // Mise à jour sans animation pour un contrôle précis
            }
          });
        });
      } else {
        // Fallback : animation simple sans stagger
        chart.data.datasets[0].data = values;
        chart.update('active');
      }
    };

    // S'assurer que GSAP est disponible avant d'utiliser ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // Utiliser GSAP ScrollTrigger pour déclencher l'animation quand le graphique entre dans le viewport
      gsap.fromTo(canvas,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: canvas.closest('.chart-window') || canvas,
            start: "top 75%",
            onEnter: () => triggerChartAnimation(),
          }
        }
      );
    } else {
      // Fallback : utiliser Intersection Observer si GSAP n'est pas disponible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animationTriggered) {
            triggerChartAnimation();
            observer.unobserve(entry.target);
            toggleActions: "play none none reverse"
          }
        });
      }, { threshold: 0.25 });
      
      observer.observe(canvas);
    }
  })
  .catch(error => console.error('Erreur lors du chargement des données:', error));