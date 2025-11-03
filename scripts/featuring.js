fetch("./data/feat.json")
      .then(response => response.json())
      .then(donnees => {
        const annees = donnees.map(item => item["Année"]);
        const entrees = donnees.map(item => item["Total des featurings"]);

        const ctx = document.getElementById("graphique");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: annees,
            datasets: [{
              label: "Total des featurings par années",
              data: entrees,
              backgroundColor: "#21abb5",
              borderColor: "#00EEFF",
              borderWidth: 1
            }]
          },
          options: {
            responsive: false,
            scales: { y: { beginAtZero: true } },
            plugins : { legend: { position: "bottom" } } // afin de mettre la légende en bas
          }
        });
      })
      .catch(erreur => console.log("Erreur :", erreur));