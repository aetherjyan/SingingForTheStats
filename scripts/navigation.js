// Navigation active - Met à jour le bouton actif selon la section visible

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Fonction pour mettre à jour le lien actif
    function updateActiveLink(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const li = link.closest('li');
            if (href === `#${targetId}`) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }
    
    // Fonction pour calculer la proportion de la section visible dans le viewport
    function getVisibleRatio(section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculer la partie visible de la section
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Retourner le ratio de visibilité (0 = pas visible, 1 = entièrement visible)
        return visibleHeight / rect.height;
    }
    
    // Fonction pour trouver la section active - celle qui est la plus visible dans le viewport
    function getActiveSection() {
        let activeSection = null;
        let maxVisibleArea = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Vérifier si la section est au moins partiellement visible dans le viewport
            const isVisible = rect.bottom > 0 && rect.top < viewportHeight;
            
            if (isVisible) {
                const visibleRatio = getVisibleRatio(section);
                
                // Calculer l'aire visible (en pixels)
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const visibleArea = visibleHeight * rect.width;
                
                // Prioriser la section qui :
                // 1. A au moins 15% de visibilité (pour éviter les sections à peine visibles)
                // 2. Occupe le plus d'espace dans le viewport
                if (visibleRatio > 0.15 && visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    activeSection = section;
                } else if (visibleRatio > 0.15 && Math.abs(visibleArea - maxVisibleArea) < 1000) {
                    // Si les aires sont similaires, prendre celle qui est la plus proche du haut
                    const currentRect = activeSection ? activeSection.getBoundingClientRect() : null;
                    if (!currentRect || Math.abs(rect.top) < Math.abs(currentRect.top)) {
                        maxVisibleArea = visibleArea;
                        activeSection = section;
                    }
                }
            }
        });
        
        return activeSection;
    }
    
    // Intersection Observer pour détecter la section visible
    // On utilise une marge négative pour ne considérer que les sections vraiment visibles
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px', // Section doit occuper au moins 50% du viewport
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] // Plusieurs seuils pour une détection précise
    };
    
    const observer = new IntersectionObserver((entries) => {
        // Calculer quelle section occupe le plus d'espace dans le viewport
        let bestSection = null;
        let maxVisibleArea = 0;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.target.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Calculer la zone visible de la section dans le viewport
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                
                // Calculer la proportion visible (hauteur visible / hauteur totale)
                const visibleRatio = visibleHeight / rect.height;
                
                // Calculer l'aire visible (en pixels)
                const visibleArea = visibleHeight * rect.width;
                
                // Prioriser la section qui :
                // 1. A le plus grand ratio de visibilité ET occupe le plus d'espace
                // 2. Ou est la plus proche du haut du viewport si les ratios sont similaires
                if (visibleRatio > 0.15 && visibleArea > maxVisibleArea) { // Au moins 15% visible
                    maxVisibleArea = visibleArea;
                    bestSection = entry.target;
                } else if (visibleRatio > 0.15 && Math.abs(visibleArea - maxVisibleArea) < 1000) {
                    // Si les aires sont similaires, prendre celle qui est la plus proche du haut
                    const currentRect = bestSection ? bestSection.getBoundingClientRect() : null;
                    if (!currentRect || Math.abs(rect.top) < Math.abs(currentRect.top)) {
                        maxVisibleArea = visibleArea;
                        bestSection = entry.target;
                    }
                }
            }
        });
        
        if (bestSection) {
            const sectionId = bestSection.getAttribute('id');
            updateActiveLink(sectionId);
        }
    }, observerOptions);
    
    // Observer toutes les sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Mettre à jour au chargement de la page
    function setInitialActive() {
        const activeSection = getActiveSection();
        if (activeSection) {
            const sectionId = activeSection.getAttribute('id');
            updateActiveLink(sectionId);
        }
    }
    
    // Définir l'état initial
    setInitialActive();
    
    // Mettre à jour aussi lors du scroll (pour une réactivité immédiate)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                setInitialActive();
                ticking = false;
            });
            ticking = true;
        }
    });
});

