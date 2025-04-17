
/**
 * Ce fichier contient des fonctions de préchargement pour améliorer l'expérience utilisateur
 * en chargeant à l'avance les composants essentiels pendant les temps d'inactivité
 */

// Préchargement des composants critiques
export function preloadCriticalComponents() {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    // @ts-ignore - TypeScript ne reconnaît pas requestIdleCallback
    window.requestIdleCallback(() => {
      // Précharger les composants du détail média
      import('./components/media-detail/media-detail-actions');
      import('./components/media-detail/media-content');
      import('./components/media-detail/tabs/overview-tab');
      
      // Précharger les services essentiels
      import('./services/media/search-service');
      import('./services/media/library-service');
      
      console.log('Composants critiques préchargés');
    });
  }
}

// Préchargement des composants secondaires
export function preloadSecondaryComponents() {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    // @ts-ignore - TypeScript ne reconnaît pas requestIdleCallback
    window.requestIdleCallback(() => {
      // Précharger les onglets de détail média
      import('./components/media-detail/tabs/rating-tab');
      import('./components/media-detail/tabs/where-to-watch');
      import('./components/media-detail/tabs/progression');
      
      console.log('Composants secondaires préchargés');
    }, { timeout: 5000 });
  }
}
