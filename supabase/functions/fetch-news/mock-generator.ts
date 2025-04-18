
import { NewsItem } from './types.ts';

// Generate mock news when all other methods fail
export function generateMockNews(): NewsItem[] {
  const categories: ('film' | 'serie' | 'book' | 'game' | 'general')[] = ['film', 'serie', 'book', 'game', 'general'];
  const sources = ['ActuGaming', 'Ecran Large', 'ActuaLitté', 'Fnac', 'Le Monde Culture'];
  
  const mockNews: NewsItem[] = [];
  
  // Generate 20 mock news items
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    let title = '';
    let description = '';
    
    switch (category) {
      case 'film':
        title = `Nouveau film à découvrir : Le titre prometteur ${i + 1}`;
        description = 'Un film qui va marquer les esprits avec son scénario original et ses acteurs talentueux.';
        break;
      case 'serie':
        title = `La série événement : Saison ${i % 5 + 1} de Titre Captivant`;
        description = 'Une nouvelle saison qui promet rebondissements et émotions pour les fans.';
        break;
      case 'book':
        title = `Le livre du mois : L'aventure littéraire ${i + 1}`;
        description = 'Un roman qui vous transportera dans un univers fascinant créé par un auteur visionnaire.';
        break;
      case 'game':
        title = `Le jeu qui va tout changer : Titre Immersif ${i + 1}`;
        description = 'Une expérience de jeu révolutionnaire qui redéfinit les standards du genre.';
        break;
      default:
        title = `Actualité culturelle : Un événement à ne pas manquer ${i + 1}`;
        description = 'Une opportunité unique de découvrir des œuvres qui marqueront leur temps.';
    }
    
    mockNews.push({
      id: `mock-${i}`,
      title,
      link: 'https://example.com',
      source,
      date: new Date().toISOString(),
      image: 'https://via.placeholder.com/500x300',
      category,
      description,
    });
  }
  
  return mockNews;
}
