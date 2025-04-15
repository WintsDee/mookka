
import { SOURCES } from './sources.ts';
import { parseRSSFeed } from './rss-parser.ts';
import { scrapeWebPage } from './web-scraper.ts';
import { generateMockNews } from './mock-generator.ts';
import { NewsItem } from './types.ts';

// Main function to fetch news
export async function fetchAllNews(): Promise<NewsItem[]> {
  console.log(`Starting to fetch news from ${SOURCES.length} sources`);
  const newsPromises: Promise<NewsItem[]>[] = [];
  
  // Try RSS feeds first
  for (const source of SOURCES) {
    if (source.rss) {
      console.log(`Adding RSS fetch task for ${source.name} from ${source.rss}`);
      newsPromises.push(fetchWithTimeout(
        () => parseRSSFeed(source.rss!, source.name),
        15000,
        `RSS fetch for ${source.name}`
      ));
    } else {
      // For others, try direct scraping
      console.log(`Adding web scraping task for ${source.name} from ${source.url}`);
      newsPromises.push(fetchWithTimeout(
        () => scrapeWebPage(source.url, source.name),
        15000,
        `Web scraping for ${source.name}`
      ));
    }
  }
  
  // Process all fetches in parallel
  const results = await Promise.allSettled(newsPromises);
  
  let allNews: NewsItem[] = [];
  let successCount = 0;
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const sourceName = SOURCES[index].name;
      const sourceItems = result.value;
      
      if (sourceItems.length > 0) {
        console.log(`Successfully fetched ${sourceItems.length} news items from ${sourceName}`);
        allNews = [...allNews, ...sourceItems];
        successCount++;
      } else {
        console.warn(`Successfully connected to ${sourceName} but got 0 items`);
      }
    } else {
      console.error(`Failed to fetch news from ${SOURCES[index].name}: ${result.reason}`);
    }
  });
  
  console.log(`Total news sources successfully fetched: ${successCount}/${SOURCES.length}`);
  console.log(`Total news items fetched: ${allNews.length}`);
  
  // If we couldn't fetch enough real news, return mock news
  if (allNews.length < 5) {
    console.log('Too few real news fetched, returning mock news');
    return generateMockNews();
  }
  
  // Filter out news that are likely advertisements
  const filteredNews = allNews.filter(news => {
    if (!news.title) return false;
    
    const lowerTitle = news.title.toLowerCase();
    return !lowerTitle.includes('sponsor') && 
           !lowerTitle.includes('publicité') && 
           !lowerTitle.includes('partenaire') &&
           !lowerTitle.includes('en ce moment');
  });
  
  console.log(`News after filtering: ${filteredNews.length}`);
  
  // Sort by date (most recent first)
  filteredNews.sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } catch (e) {
      return 0;
    }
  });
  
  return filteredNews;
}

// Helper function to add timeout to fetch operations
async function fetchWithTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    try {
      const result = await fetchFn();
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}
