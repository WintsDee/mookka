
import { NewsItem } from './types.ts';

/**
 * Generates mock news data when real news fetching fails
 * This is used as a fallback to ensure users always see content
 */
export function generateMockNews(): NewsItem[] {
  console.log('Generating mock news data as fallback');
  
  const categories = ['film', 'serie', 'book', 'game', 'general'] as const;
  const mockNews: NewsItem[] = [];
  
  // Generate 20 mock news items
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48)); // Random time in last 48 hours
    
    const mockItem: NewsItem = {
      id: `mock-${i}-${Date.now()}`,
      title: getMockTitleForCategory(category),
      link: "https://example.com/mock-article",
      source: getMockSourceForCategory(category),
      date: date.toISOString(),
      image: getMockImageForCategory(category),
      category: category,
      description: "Cet article est généré automatiquement lorsque la récupération des actualités échoue. Consultez les actualités en ligne pour des informations à jour."
    };
    
    mockNews.push(mockItem);
  }
  
  // Sort by date (most recent first)
  mockNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return mockNews;
}

function getMockTitleForCategory(category: 'film' | 'serie' | 'book' | 'game' | 'general'): string {
  const titles = {
    film: [
      "Nouveau film à succès bat des records au box-office",
      "Le réalisateur annonce une suite pour son film primé",
      "Une actrice renommée rejoint le casting du prochain blockbuster",
      "Le tournage du film tant attendu vient de commencer",
      "Critique: le nouveau film qui fait sensation"
    ],
    serie: [
      "La série phénomène renouvelée pour une nouvelle saison",
      "Le final de saison qui a surpris tous les spectateurs",
      "Un acteur emblématique quitte la série après 5 saisons",
      "La plateforme de streaming annonce une série originale",
      "Date de sortie révélée pour la nouvelle saison attendue"
    ],
    book: [
      "Le nouveau roman de l'auteur à succès en tête des ventes",
      "Un livre culte adapté prochainement au cinéma",
      "Prix littéraire: découvrez le lauréat de cette année",
      "La suite de la saga littéraire enfin annoncée",
      "L'écrivain révèle les secrets de son processus créatif"
    ],
    game: [
      "Le jeu vidéo qui révolutionne le genre vient de sortir",
      "Une mise à jour majeure annoncée pour le jeu populaire",
      "Le studio dévoile son prochain titre en développement",
      "Le jeu indépendant qui cartonne contre toute attente",
      "La console next-gen bat tous les records de vente"
    ],
    general: [
      "Les tendances culturelles qui marquent cette année",
      "L'événement médiatique qui a captivé le public",
      "Retour sur le phénomène culturel du moment",
      "L'industrie du divertissement face à de nouveaux défis",
      "Le crossover inattendu entre deux univers populaires"
    ]
  };
  
  const categoryTitles = titles[category];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function getMockSourceForCategory(category: 'film' | 'serie' | 'book' | 'game' | 'general'): string {
  const sources = {
    film: ["Première", "AlloCiné", "CinémaTeaser", "Ecran Large"],
    serie: ["CineSeries", "Télé Loisirs", "Télé 7 Jours", "Série Club"],
    book: ["Actualitté", "Librairie Mollat", "Idboox", "L'Express Livres"],
    game: ["ActuGaming", "Gamekult", "Canard PC", "JeuxVideo.com"],
    general: ["Le Monde Culture", "Télérama", "Culture Box", "Les Inrockuptibles"]
  };
  
  const categorySources = sources[category];
  return categorySources[Math.floor(Math.random() * categorySources.length)];
}

function getMockImageForCategory(category: 'film' | 'serie' | 'book' | 'game' | 'general'): string {
  // Return a placeholder image URL
  return '/placeholder.svg';
}
