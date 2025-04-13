
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

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
  },
  {
    name: 'Ecran Large',
    url: 'https://www.ecranlarge.com/',
    category: 'film',
  },
  {
    name: 'ActuaLitté',
    url: 'https://www.actualitte.com/',
    category: 'book',
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

// Generic RSS feed parser
async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} RSS: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const news: NewsItem[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const description = item.querySelector('description')?.textContent || '';
      
      // Extract image
      let image = '';
      const enclosure = item.querySelector('enclosure[type^="image"]');
      if (enclosure) {
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

// Fallback HTML scraper for sites without RSS
async function scrapeWebPage(url: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} page: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const news: NewsItem[] = [];
    
    // Different selectors for different sources
    let articles: NodeListOf<Element>;
    
    switch (source) {
      case 'ActuGaming':
        articles = doc.querySelectorAll('article.jeg_post');
        break;
      case 'Ecran Large':
        articles = doc.querySelectorAll('.post-card');
        break;
      case 'ActuaLitté':
        articles = doc.querySelectorAll('article.article');
        break;
      case 'Fnac':
        articles = doc.querySelectorAll('article.article-main');
        break;
      case 'Le Monde Culture':
        articles = doc.querySelectorAll('article.article');
        break;
      default:
        articles = doc.querySelectorAll('article');
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
          title = article.querySelector('h3.jeg_post_title')?.textContent?.trim() || '';
          link = article.querySelector('a.jeg_post_title')?.getAttribute('href') || '';
          image = article.querySelector('img')?.getAttribute('src') || '';
          description = article.querySelector('.jeg_post_excerpt')?.textContent?.trim() || '';
          break;
        case 'Ecran Large':
          title = article.querySelector('.post-card__title')?.textContent?.trim() || '';
          link = article.querySelector('a.post-card__link')?.getAttribute('href') || '';
          image = article.querySelector('img')?.getAttribute('data-src') || article.querySelector('img')?.getAttribute('src') || '';
          description = article.querySelector('.post-card__description')?.textContent?.trim() || '';
          break;
        case 'ActuaLitté':
          title = article.querySelector('h2')?.textContent?.trim() || '';
          link = article.querySelector('a')?.getAttribute('href') || '';
          image = article.querySelector('img')?.getAttribute('src') || '';
          description = article.querySelector('.chapeau')?.textContent?.trim() || '';
          break;
        case 'Fnac':
          title = article.querySelector('h2')?.textContent?.trim() || '';
          link = article.querySelector('a')?.getAttribute('href') || '';
          image = article.querySelector('img')?.getAttribute('src') || '';
          description = article.querySelector('p')?.textContent?.trim() || '';
          break;
        case 'Le Monde Culture':
          title = article.querySelector('h3')?.textContent?.trim() || '';
          link = article.querySelector('a')?.getAttribute('href') || '';
          image = article.querySelector('img')?.getAttribute('src') || '';
          description = article.querySelector('.article__desc')?.textContent?.trim() || '';
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

// Main function to fetch news
async function fetchAllNews(): Promise<NewsItem[]> {
  const newsPromises: Promise<NewsItem[]>[] = [];
  
  // Try RSS feeds first
  for (const source of SOURCES) {
    // For ActuGaming
    if (source.name === 'ActuGaming') {
      newsPromises.push(parseRSSFeed('https://www.actugaming.net/feed/', source.name));
    }
    // For Ecran Large
    else if (source.name === 'Ecran Large') {
      newsPromises.push(parseRSSFeed('https://www.ecranlarge.com/rss', source.name));
    }
    // For ActuaLitté
    else if (source.name === 'ActuaLitté') {
      newsPromises.push(parseRSSFeed('https://www.actualitte.com/rss/flux.xml', source.name));
    }
    // For others, try direct scraping
    else {
      newsPromises.push(scrapeWebPage(source.url, source.name));
    }
  }
  
  const allNewsArrays = await Promise.all(newsPromises);
  let allNews = allNewsArrays.flat();
  
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
