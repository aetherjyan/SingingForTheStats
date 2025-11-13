// Sélection de tous les projets
const projets = document.querySelectorAll('.projet');


    projet.addEventListener('click', () => {
        // Création de l'overlay
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');

        // Création du popup
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Bouton de fermeture
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('popup-close');
        closeBtn.innerHTML = '<p><b>FERMER</b></p>>';

        // Contenu du popup (tu peux personnaliser selon le projet)
        popup.innerHTML = `
        <div id="mentions-popup" class="popup-overlay"> 
        <div class="popup-content"> <button class="close-popup">&times;</button> <h3>Mentions légales</h3> 
        <p> Le site web a été réalisé dans le cadre d’un projet universitaire. 
        <br>Ce site a été conçu à des fins non lucratives. 
        </p> <h3>Propriété intellectuelle</h3> 
        <p>Les contenus présents sur ce site (textes, images, vidéos, codes, graphismes, etc.) sont la propriété de leurs auteurs respectifs.
        </p> 
        <h3>Crédits</h3> 
        <p>Réalisation : Amal AZIZI, Thomas PANG, Kelly MAKAYA--MOUSSOKI <br>Année universitaire : 2025–2026 
        </p> 
        <h3>Données personnelles</h3> 
        <p> Ce site ne collecte aucune donnée personnelle. Aucune information concernant les visiteurs n’est enregistrée, partagée ou utilisée à des fins d’analyse, de suivi ou de communication. 
        </p> 
        <br> <p>Sources 
        <br>1 
        <br>2 
        <br>3 
        </p> 
        </div> 
        </div>
      `;

        // On ajoute le bouton de fermeture au popup
        popup.appendChild(closeBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Fermeture du popup au clic sur le bouton
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        // Fermeture si on clique à l’extérieur du popup
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    });