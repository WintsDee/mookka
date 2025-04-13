
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { NewsItem } from './types.ts';
import { detectMediaType } from './category-detector.ts';

// Parse RSS feed using Deno DOM
export async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
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
