
import { NewsItem } from './types.ts';

// Generate minimal mock news when all other methods fail
export function generateMockNews(): NewsItem[] {
  return [{
    id: 'mock-1',
    title: 'Actualité temporaire',
    link: 'https://example.com',
    source: 'Source temporaire',
    date: new Date().toISOString(),
    image: 'https://via.placeholder.com/500x300',
    category: 'general',
    description: 'Les actualités ne sont pas disponibles pour le moment.',
  }];
}
