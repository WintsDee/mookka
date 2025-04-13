
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { load } from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  image: string;
  category: 'film' | 'serie' | 'book' | 'game' | 'general';
  description?: string;
}

const SOURCES = [
  {
    name: 'ActuGaming',
    url: 'https://www.actugaming.net/',
    category: 'game',
    rss: 'https://www.actugaming.net/feed/'
  },
  {
    name: 'Ecran Large',
    url: 'https://www.ecranlarge.com/',
    category: 'film',
    rss: 'https://www.ecranlarge.com/rss'
  },
  {
    name: 'ActuaLitté',
    url: 'https://www.actualitte.com/',
    category: 'book',
    rss: 'https://www.actualitte.com/rss/flux.xml'
  },
  {
    name: 'Fnac',
    url: 'https://leclaireur.fnac.com/',
    category: 'general',
  },
  {
    name: 'Le Monde Culture',
    url: 'https://www.lemonde.fr/culture/',
    category: 'general',
  },
];

// Function to detect media type from content
function detectMediaType(title: string, description: string, source: string): 'film' | 'serie' | 'book' | 'game' | 'general' {
  title = title.toLowerCase();
  description = description.toLowerCase();
  
  // Default category based on the source
  let defaultCategory: 'film' | 'serie' | 'book' | 'game' | 'general' = 'general';
  
  switch(source) {
    case 'ActuGaming':
      defaultCategory = 'game';
      break;
    case 'Ecran Large':
      // Detect if it's a film or serie
      if (title.includes('série') || title.includes('saison') || description.includes('série') || description.includes('saison') || description.includes('épisode')) {
        return 'serie';
      }
      return 'film';
    case 'ActuaLitté':
      defaultCategory = 'book';
      break;
    default:
      // For general sources, try to detect the category
      if (title.includes('livre') || title.includes('roman') || title.includes('bd') || title.includes('manga') || description.includes('livre') || description.includes('roman') || description.includes('bd') || description.includes('manga')) {
        return 'book';
      } else if (title.includes('film') || title.includes('cinéma') || description.includes('film') || description.includes('cinéma')) {
        return 'film';
      } else if (title.includes('série') || title.includes('saison') || description.includes('série') || description.includes('saison') || description.includes('épisode')) {
        return 'serie';
      } else if (title.includes('jeu') || title.includes('console') || title.includes('ps5') || title.includes('xbox') || title.includes('switch') || description.includes('jeu') || description.includes('console') || description.includes('ps5') || description.includes('xbox') || description.includes('switch')) {
        return 'game';
      }
      return 'general';
  }
  
  return defaultCategory;
}

// Parse RSS feed using Deno DOM
async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} RSS: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    if (!xmlDoc) {
      console.error(`Failed to parse XML from ${source}`);
      return [];
    }
    
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    const news: NewsItem[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const description = item.querySelector('description')?.textContent || '';
      
      // Extract image
      let image = '';
      const enclosure = item.querySelector('enclosure[type^="image"]');
      if (enclosure && enclosure.getAttribute) {
        image = enclosure.getAttribute('url') || '';
      } else {
        // Try to extract image from description
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          image = imgMatch[1];
        }
      }
      
      // Detect the media type
      const category = detectMediaType(title, description, source);
      
      news.push({
        id: `${source}-${index}`,
        title,
        link,
        source,
        date: new Date(pubDate).toISOString(),
        image,
        category,
        description,
      });
    });
    
    return news;
  } catch (error) {
    console.error(`Error parsing RSS from ${source}:`, error);
    return [];
  }
}

// Scrape web page using Cheerio
async function scrapeWebPage(url: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} page: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const $ = load(html);
    const news: NewsItem[] = [];
    
    // Different selectors for different sources
    let articles: any[];
    
    switch (source) {
      case 'ActuGaming':
        articles = $('article.jeg_post').toArray();
        break;
      case 'Ecran Large':
        articles = $('.post-card').toArray();
        break;
      case 'ActuaLitté':
        articles = $('article.article').toArray();
        break;
      case 'Fnac':
        articles = $('article.article-main').toArray();
        break;
      case 'Le Monde Culture':
        articles = $('article.article').toArray();
        break;
      default:
        articles = $('article').toArray();
    }
    
    // Processing only the first 10 articles to avoid overload
    const maxArticles = Math.min(10, articles.length);
    
    for (let i = 0; i < maxArticles; i++) {
      const article = articles[i];
      
      let title = '';
      let link = '';
      let image = '';
      let description = '';
      
      // Extract data based on source
      switch (source) {
        case 'ActuGaming':
          title = $(article).find('h3.jeg_post_title').text().trim();
          link = $(article).find('a.jeg_post_title').attr('href') || '';
          image = $(article).find('img').attr('src') || '';
          description = $(article).find('.jeg_post_excerpt').text().trim();
          break;
        case 'Ecran Large':
          title = $(article).find('.post-card__title').text().trim();
          link = $(article).find('a.post-card__link').attr('href') || '';
          image = $(article).find('img').attr('data-src') || $(article).find('img').attr('src') || '';
          description = $(article).find('.post-card__description').text().trim();
          break;
        case 'ActuaLitté':
          title = $(article).find('h2').text().trim();
          link = $(article).find('a').attr('href') || '';
          image = $(article).find('img').attr('src') || '';
          description = $(article).find('.chapeau').text().trim();
          break;
        case 'Fnac':
          title = $(article).find('h2').text().trim();
          link = $(article).find('a').attr('href') || '';
          image = $(article).find('img').attr('src') || '';
          description = $(article).find('p').text().trim();
          break;
        case 'Le Monde Culture':
          title = $(article).find('h3').text().trim();
          link = $(article).find('a').attr('href') || '';
          image = $(article).find('img').attr('src') || '';
          description = $(article).find('.article__desc').text().trim();
          break;
      }
      
      // Only add valid articles (must have title and link)
      if (title && link) {
        // Make links absolute if they are relative
        if (link.startsWith('/')) {
          const urlObj = new URL(url);
          link = `${urlObj.origin}${link}`;
        }
        
        // Make image URLs absolute if they are relative
        if (image && image.startsWith('/')) {
          const urlObj = new URL(url);
          image = `${urlObj.origin}${image}`;
        }
        
        // Detect the media type
        const category = detectMediaType(title, description, source);
        
        news.push({
          id: `${source}-${i}`,
          title,
          link,
          source,
          date: new Date().toISOString(), // Current date as we don't have the real date
          image,
          category,
          description,
        });
      }
    }
    
    return news;
  } catch (error) {
    console.error(`Error scraping from ${source}:`, error);
    return [];
  }
}

// Generate mock news when all other methods fail
function generateMockNews(): NewsItem[] {
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

// Main function to fetch news
async function fetchAllNews(): Promise<NewsItem[]> {
  const newsPromises: Promise<NewsItem[]>[] = [];
  
  // Try RSS feeds first
  for (const source of SOURCES) {
    if (source.rss) {
      newsPromises.push(parseRSSFeed(source.rss, source.name));
    } else {
      // For others, try direct scraping
      newsPromises.push(scrapeWebPage(source.url, source.name));
    }
  }
  
  const allNewsArrays = await Promise.all(newsPromises);
  let allNews = allNewsArrays.flat();
  
  // If we couldn't fetch any real news, return mock news
  if (allNews.length === 0) {
    console.log('No real news fetched, returning mock news');
    return generateMockNews();
  }
  
  // Filter out news that are likely advertisements
  allNews = allNews.filter(news => {
    const lowerTitle = news.title.toLowerCase();
    return !lowerTitle.includes('sponsor') && 
           !lowerTitle.includes('publicité') && 
           !lowerTitle.includes('partenaire') &&
           !lowerTitle.includes('en ce moment');
  });
  
  // Sort by date (most recent first)
  allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return allNews;
}

// Cache the news results for 1 hour
let cachedNews: NewsItem[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const currentTime = Date.now();
    let news: NewsItem[];
    
    // Check if we need to fetch fresh news or can use cached
    if (!cachedNews || (currentTime - lastFetchTime > CACHE_DURATION)) {
      console.log('Fetching fresh news...');
      news = await fetchAllNews();
      cachedNews = news;
      lastFetchTime = currentTime;
    } else {
      console.log('Using cached news');
      news = cachedNews;
    }
    
    // Get type from query parameter
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    
    // Filter by type if specified
    if (type && ['film', 'serie', 'book', 'game', 'general'].includes(type)) {
      news = news.filter(item => item.category === type);
    }
    
    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
