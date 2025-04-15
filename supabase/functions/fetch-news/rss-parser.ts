
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
        let title = titleMatch ? removeHTMLTags(titleMatch[1]) : '';
        
        // Extract link
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/s);
        const link = linkMatch ? removeHTMLTags(linkMatch[1]) : '';
        
        // Extract pubDate
        const pubDateMatch = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/s);
        const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
        
        // Extract description
        const descMatch = item.match(/<description[^>]*>(.*?)<\/description>/s);
        const description = descMatch ? removeHTMLTags(descMatch[1]) : '';
        
        // Extract image from enclosure or description with improved pattern matching
        let image = '';
        
        // Try to find image in enclosure tag
        const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/);
        if (enclosureMatch) {
          image = enclosureMatch[1];
        } else {
          // Try to extract image from description or content:encoded
          const contentMatch = item.match(/<content:encoded[^>]*>(.*?)<\/content:encoded>/s);
          const contentText = contentMatch ? contentMatch[1] : description;
          
          // Look for img tags
          const imgMatch = contentText.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          } else {
            // Look for figure tags
            const figureMatch = contentText.match(/<figure[^>]*>.*?<img[^>]+src="([^">]+)".*?<\/figure>/s);
            if (figureMatch) {
              image = figureMatch[1];
            } else {
              // Try to find image URL in media:content
              const mediaMatch = item.match(/<media:content[^>]*url="([^"]*)"[^>]*>/);
              if (mediaMatch) {
                image = mediaMatch[1];
              }
            }
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

// Helper function to remove HTML tags and decode HTML entities
function removeHTMLTags(str: string): string {
  if (!str) return '';
  
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')  // Extract content from CDATA
    .replace(/<[^>]*>/g, '')                   // Remove HTML tags
    .replace(/&lt;/g, '<')                     // Replace HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)) // Decode decimal entities
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16))) // Decode hex entities
    .replace(/&[a-z0-9]+;/g, (entity) => { // Handle named entities
      const textarea = document.createElement ? document.createElement('textarea') : { innerHTML: '', value: '' };
      textarea.innerHTML = entity;
      return textarea.value || entity;
    })
    .trim();                                   // Trim whitespace
}
