
export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  image: string;
  category: 'film' | 'serie' | 'book' | 'game' | 'general';
  description?: string;
}

export interface NewsSource {
  name: string;
  url: string;
  category: string;
  rss?: string;
}
