
import { NewsItem } from './types.ts';
import { detectMediaType } from './category-detector.ts';

// Parse RSS feed using fetch and basic string manipulation
export async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching RSS from ${source}: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} RSS: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    const news: NewsItem[] = [];
    
    // Simple XML parsing without using DOMParser
    const items = text.split('<item>').slice(1);
    
    items.forEach((item, index) => {
      try {
        // Extract title using regex
        const titleMatch = item.match(/<title[^>]*>(.*?)<\/title>/s);
        const title = titleMatch ? removeHTMLTags(titleMatch[1]) : '';
        
        // Extract link
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/s);
        const link = linkMatch ? removeHTMLTags(linkMatch[1]) : '';
        
        // Extract pubDate
        const pubDateMatch = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/s);
        const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
        
        // Extract description
        const descMatch = item.match(/<description[^>]*>(.*?)<\/description>/s);
        const description = descMatch ? removeHTMLTags(descMatch[1]) : '';
        
        // Extract image from enclosure or description
        let image = '';
        const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/);
        if (enclosureMatch) {
          image = enclosureMatch[1];
        } else {
          // Try to extract image from description
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          }
        }
        
        // Only add valid items (must have title and link)
        if (title && link) {
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
        }
      } catch (error) {
        console.error(`Error parsing item from ${source}:`, error);
        // Continue with next item
      }
    });
    
    console.log(`Successfully parsed ${news.length} items from ${source}`);
    return news;
  } catch (error) {
    console.error(`Error parsing RSS from ${source}:`, error);
    return [];
  }
}

// Helper function to remove HTML tags
function removeHTMLTags(str: string): string {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')  // Extract content from CDATA
    .replace(/<[^>]*>/g, '')                   // Remove HTML tags
    .replace(/&lt;/g, '<')                     // Replace HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();                                   // Trim whitespace
}
