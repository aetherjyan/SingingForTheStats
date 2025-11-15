const mentionsLégales = document.querySelector(".popup-mentions")

mentionsLégales.addEventListener('click', () => {
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
        <div class="popup-content"> <button class="close-popup"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button> <h3>Mentions légales</h3> 
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
        <br>2 Lien vers le code ayant permis de faire le graphique : [https://www.chartjs.org/docs/latest/samples/bar/vertical.html]
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