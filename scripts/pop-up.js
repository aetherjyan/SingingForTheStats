const mentionsLégales = document.querySelector(".popup-mentions")

mentionsLégales.addEventListener('click', () => {

    // Création de l'overlay
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');

    // Création du popup
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Contenu du popup (tu peux personnaliser selon le projet)
    popup.innerHTML = `
        <div id="mentions-popup">
            <div class="popup-content">
        
        <button class="close-popup"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button> 
        
        
        <h3>Mentions légales</h3>
    <p> Le site web a été réalisé dans le cadre d’un projet universitaire.
        <br>Ce site a été conçu à des fins non lucratives.
    </p>
    <h3>Propriété intellectuelle</h3>
    <p>Les contenus présents sur ce site (textes, images, vidéos, codes, graphismes, etc.) sont la propriété de
        leurs auteurs respectifs.
    </p>
    <h3>Crédits</h3>
    <p>Réalisation : Amal AZIZI, Thomas PANG, Kelly MAKAYA--MOUSSOKI <br>Année universitaire : 2025–2026
    </p>
    <h3>Données personnelles</h3>
    <p> Ce site collecte les données nécessaires uniquement et n'utilise aucunes données personnelles sans le consentement explicite du visiteur. 
    <br>Les données collectées sont strictement sécurisées et conservées pour la durée nécessaire à la finalité du projet. 
    <br>Aucune information concernant les visiteurs n’est enregistrée, partagée ou utilisée à des fins d’analyse, de suivi ou de communication. Aucune donnée n'est partagée avec des tiers à des fins commerciales.
    
    </p>

    
    <h3>L'éditeur</h3>
<ul>
    <li>Raison sociale : Université Gustave Eiffel</li>
    <li>Forme sociale : Établissement Public à caractère Scientifique, Culturel et Professionnel (EPSCP)</li>
    <li>Numéro SIRET : 130 026 123 00013</li>
    <li>Adresse physique du siège social : CAMPUS DE MARNE-LA-VALLEE 5 BOULEVARD DESCARTES 77420 CHAMPS-SUR-MARNE.</li>
    <li>Téléphone :<a href="tel:01 60 95 75 00">01 60 95 75 00</a></li>
    <li>Code APE : 85.422</li>
    <li>Directeur de la publication : Gilles Roussel</li>
</ul>

<h3>Déléguée à la Protection des Données de l'Université Gustave Eiffel (DPO - RGPD)</h3>
<ul>
    <li>Véronique juge </li>
    <li><a href="mailto:protectiondesdonnees-dpo@univ-eiffel.fr">protectiondesdonnees-dpo@univ-eiffel.fr</a></li>
    <li><a href="tel:01 60 95 75 00">01 60 95 75 00</a></li>
    <li>77454 Marne-la-Vallée cedex 2</li>
    <li>Conformément à la loi Informatique et Libertés et du Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant le DPO : <a href="mailto:protectiondesdonnees-dpo@univ-eiffel.fr">protectiondesdonnees-dpo@univ-eiffel.fr</a>.</li>
</ul>
<h3>L'hébergeur</h3>
<ul>
    <li>GitHub</li>
    <li>Adresse physique du siège social : Boulevard Prins Bernhardplein 20 - Amsterdam 1097 JB - Pays-Bas </li>
    <li>Site web : <a href="https://pages.github.com/">https://pages.github.com/</a></li>
    <li>Politique de conservation des données de GitHub : GitHub conserve les données tant que nécessaire pour fournir ses services, respecter les obligations légales ou résoudre des litiges. Les dépôts publics sont conservés indéfiniment, sauf suppression, tandis que les dépôts privés sont protégés. Les utilisateurs peuvent demander la suppression ou modification de leurs données.</li>
</ul>


<h3>Sources et crédits</h3>
<h3>Sources de données musicales</h3>
<p>
    <ul>
        <li>¹ L'évolution de la durée moyenne d’une chanson de 1999 à 2023 <a href="https://www.kaggle.com/datasets/conorvaneden/best-songs-on-spotify-for-every-year-2000-2023/code">https://www.kaggle.com/datasets/conorvaneden/best-songs-on-spotify-for-every-year-2000-2023/code</a>  </li>
        <li>⁴ L'évolution du nombre de featurings de 2000 à 2023 dans le Billboard <a href="https://www.billboard.com/charts/hot-100/">https://www.billboard.com/charts/hot-100/</a> </li>
        <li>⁸ L’impact de Tiktok sur le Billboard Global 200 (en 2024) <a href="https://newsroom.tiktok.com/tiktok-and-luminate-release-latest-music-impact-report?lang=en">https://newsroom.tiktok.com/tiktok-and-luminate-release-latest-music-impact-report?lang=en</a> </li>
    </ul>
</p>

<h3>Sources musicales</h3>
<p>
<ul>Lecteurs Spotify intégrés (les contenus restent hébergés par Spotify).
<br>
<li>You Suffer - Napalm Death ℗ 1987 Earache Records Ltd, <a href="https://open.spotify.com/intl-fr/track/5oD2Z1OOx1Tmcu2mc9sLY2?si=d308d93f739e45b4">https://open.spotify.com/intl-fr/track/5oD2Z1OOx1Tmcu2mc9sLY2?si=d308d93f739e45b4</a>  </li>
<li>You Suffer - Napalm Death - Paroles de Genuis <a href="https://genius.com/Napalm-death-you-suffer-lyrics">https://genius.com/Napalm-death-you-suffer-lyrics</a>  </li>
<li>Shri Ram Charit Manas: Pt.1 - JAGADEESH PILLAI : Source: Onam Creations © 2023 TRADITIONAL ℗ 2023 JAGADEESH PILLAI, <a href="https://open.spotify.com/intl-fr/track/77sb4KLyDEh7123qeCPAi7?si=af846294e47e4816">https://open.spotify.com/intl-fr/track/77sb4KLyDEh7123qeCPAi7?si=af846294e47e4816</a>  </li>
<li>Despacito - Luis Fonsi, Daddy Yankee : UMLE - Latino, Pulse Publishing Administration, Sony Music Publishing, <a href="https://open.spotify.com/intl-fr/track/6habFhsOp2NvshLv26DqMb?si=1fa612f9c60f49aa">https://open.spotify.com/intl-fr/track/6habFhsOp2NvshLv26DqMb?si=1fa612f9c60f49aa</a>  
</li>
<li>Stay (with Justin Bieber) - The Kid LAROI, Justin Bieber : Columbia, Pulse Publishing Administration, Universal Music Publishing, Warner Chappell Music, <a href="https://open.spotify.com/intl-fr/track/5HCyWlXZPP0y6Gqq8TgA20?si=61ab36bba7e542fb">https://open.spotify.com/intl-fr/track/5HCyWlXZPP0y6Gqq8TgA20?si=61ab36bba7e542fb</a>  
</li>
<li>Old Town Road (feat.Billy Ray Cyrus) Remix - Lil Nas X, Billy Ray Cyrus : Columbia, Kobalt Music Publishing, <a href="https://open.spotify.com/intl-fr/track/2YpeDb67231RjR0MgVLzsG?si=8be58f3b2ac54699">https://open.spotify.com/intl-fr/track/2YpeDb67231RjR0MgVLzsG?si=8be58f3b2ac54699</a> </li>
<li>luther (with sza) - Kendrick Lamar, SZA : Source: pgLang, under exclusive license to Interscope Records, BMG Publishing, Sony Music Publishing, Universal Music Publishing, <a href="https://open.spotify.com/intl-fr/track/2CGNAOSuO1MEFCbBRgUzjd?si=17288057f2d04bed">https://open.spotify.com/intl-fr/track/2CGNAOSuO1MEFCbBRgUzjd?si=17288057f2d04bed </a> 
</li>
<li>Beat Automotivo Tan Tan Tan Viral - WZ Beat : Source: WZ Beat, <a href="https://open.spotify.com/intl-fr/track/0MW3v87yrCJGoPRZHBqTgc?si=bc4778fe7e7c4930">https://open.spotify.com/intl-fr/track/0MW3v87yrCJGoPRZHBqTgc?si=bc4778fe7e7c4930</a>  </li>
</ul>
</p>



<h3>Images et visuels</h3>
<p> 
    <p>Images des pochettes d’albums :
<br>Fournies par Spotify via l’API Spotify. Les images restent hébergées par Spotify. Les droits sur les pochettes appartiennent à leurs labels respectifs.
</p>
<br>
<ul>
    <li>Couverture de l’album “Scum” par Napalm Death, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “Shri Ram Charit Manas” par “JAGADEESH PILLAI”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “VIDA” par “Luis Fonsi”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “STAY (with Justin Bieber)” par “The Kid LAROI”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “7” par “Lil Nas X”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “GNX” par “Kendrick Lamar”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
    <li>Couverture de l’album “Beat Automotivo Tan Tan Tan Viral” par “WZ Beat”, image fournie via l’API Spotify (hébergée par Spotify), Source : Spotify.
</li>
</ul>
</p>
        </div> 
        </div>
      `;

// Ajout au DOM
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Fermeture via la croix
    popup.querySelector(".close-popup").addEventListener("click", () => {
        overlay.remove();
    });

    // Fermeture en cliquant en dehors
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
});