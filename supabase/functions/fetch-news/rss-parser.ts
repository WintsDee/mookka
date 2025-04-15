
import { NewsItem } from './types.ts';
import { detectMediaType } from './category-detector.ts';

// Parse RSS feed using fetch and basic string manipulation
export async function parseRSSFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching RSS from ${source}: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MookkaNewsAggregator/1.0; +https://mookka.app)'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source} RSS: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    const news: NewsItem[] = [];
    
    // Simple XML parsing without using DOMParser
    const items = text.split('<item>').slice(1);
    
    if (items.length === 0) {
      // Try alternate format (some feeds use <entry> instead of <item>)
      const entries = text.split('<entry>').slice(1);
      if (entries.length > 0) {
        return parseAtomFeed(entries, source);
      }
    }
    
    items.forEach((item, index) => {
      try {
        // Extract title using regex
        const titleMatch = item.match(/<title[^>]*>(.*?)<\/title>/s);
        const title = titleMatch ? cleanHTML(titleMatch[1]) : '';
        
        // Extract link
        let link = '';
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/s);
        if (linkMatch) {
          link = cleanHTML(linkMatch[1]);
        } else {
          // Some feeds have link as an attribute
          const linkAttrMatch = item.match(/<link[^>]*href="([^"]*)"[^>]*>/);
          if (linkAttrMatch) {
            link = linkAttrMatch[1];
          }
        }
        
        // Extract pubDate
        let pubDate = '';
        const pubDateMatch = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/s);
        if (pubDateMatch) {
          pubDate = pubDateMatch[1];
        } else {
          // Try dc:date format
          const dcDateMatch = item.match(/<dc:date[^>]*>(.*?)<\/dc:date>/s);
          if (dcDateMatch) {
            pubDate = dcDateMatch[1];
          } else {
            // Try published format
            const publishedMatch = item.match(/<published[^>]*>(.*?)<\/published>/s);
            if (publishedMatch) {
              pubDate = publishedMatch[1];
            }
          }
        }
        
        // Extract description
        let description = '';
        const descMatch = item.match(/<description[^>]*>(.*?)<\/description>/s);
        if (descMatch) {
          description = cleanHTML(descMatch[1]);
        } else {
          // Try content:encoded format
          const contentMatch = item.match(/<content:encoded[^>]*>(.*?)<\/content:encoded>/s);
          if (contentMatch) {
            description = cleanHTML(contentMatch[1]);
          } else {
            // Try summary format
            const summaryMatch = item.match(/<summary[^>]*>(.*?)<\/summary>/s);
            if (summaryMatch) {
              description = cleanHTML(summaryMatch[1]);
            }
          }
        }
        
        // Extract image from enclosure, media:content, or description
        let image = '';
        
        // Try enclosure first
        const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/);
        if (enclosureMatch && enclosureMatch[1].match(/\.(jpg|jpeg|png|gif)$/i)) {
          image = enclosureMatch[1];
        } else {
          // Try media:content
          const mediaContentMatch = item.match(/<media:content[^>]*url="([^"]*)"[^>]*>/);
          if (mediaContentMatch) {
            image = mediaContentMatch[1];
          } else {
            // Try media:thumbnail
            const mediaThumbnailMatch = item.match(/<media:thumbnail[^>]*url="([^"]*)"[^>]*>/);
            if (mediaThumbnailMatch) {
              image = mediaThumbnailMatch[1];
            } else {
              // Extract first image from description
              const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }
          }
        }
        
        // Only add valid items (must have title and link)
        if (title && link) {
          // Detect the media type
          const category = detectMediaType(title, description, source);
          
          // Make sure the date is valid, default to current time if not
          const date = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
          
          news.push({
            id: `${source}-${index}-${Date.now()}`,
            title,
            link,
            source,
            date,
            image,
            category,
            description: description.length > 1000 ? description.substring(0, 1000) + '...' : description,
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

// Parse Atom feeds (entries instead of items)
function parseAtomFeed(entries: string[], source: string): NewsItem[] {
  const news: NewsItem[] = [];
  
  entries.forEach((entry, index) => {
    try {
      // Extract title
      const titleMatch = entry.match(/<title[^>]*>(.*?)<\/title>/s);
      const title = titleMatch ? cleanHTML(titleMatch[1]) : '';
      
      // Extract link
      let link = '';
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*>/);
      if (linkMatch) {
        link = linkMatch[1];
      }
      
      // Extract published date
      let pubDate = '';
      const publishedMatch = entry.match(/<published[^>]*>(.*?)<\/published>/s);
      if (publishedMatch) {
        pubDate = publishedMatch[1];
      } else {
        const updatedMatch = entry.match(/<updated[^>]*>(.*?)<\/updated>/s);
        if (updatedMatch) {
          pubDate = updatedMatch[1];
        }
      }
      
      // Extract content or summary
      let description = '';
      const contentMatch = entry.match(/<content[^>]*>(.*?)<\/content>/s);
      if (contentMatch) {
        description = cleanHTML(contentMatch[1]);
      } else {
        const summaryMatch = entry.match(/<summary[^>]*>(.*?)<\/summary>/s);
        if (summaryMatch) {
          description = cleanHTML(summaryMatch[1]);
        }
      }
      
      // Extract image
      let image = '';
      const mediaContentMatch = entry.match(/<media:content[^>]*url="([^"]*)"[^>]*>/);
      if (mediaContentMatch) {
        image = mediaContentMatch[1];
      } else {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          image = imgMatch[1];
        }
      }
      
      if (title && link) {
        const category = detectMediaType(title, description, source);
        const date = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
        
        news.push({
          id: `${source}-${index}-${Date.now()}`,
          title,
          link,
          source,
          date,
          image,
          category,
          description: description.length > 1000 ? description.substring(0, 1000) + '...' : description,
        });
      }
    } catch (error) {
      console.error(`Error parsing entry from ${source}:`, error);
    }
  });
  
  return news;
}

// Helper function to clean HTML content
function cleanHTML(str: string): string {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1') // Extract content from CDATA
    .replace(/<[^>]*>/g, '')                  // Remove HTML tags
    .replace(/&lt;/g, '<')                    // Replace HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')                     // Normalize whitespace
    .trim();                                  // Trim whitespace
}
