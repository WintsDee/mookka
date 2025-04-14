
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
      newsPromises.push(parseRSSFeed(source.rss, source.name));
    } else {
      // For others, try direct scraping
      console.log(`Adding web scraping task for ${source.name} from ${source.url}`);
      newsPromises.push(scrapeWebPage(source.url, source.name));
    }
  }
  
  // Process all fetches in parallel
  const results = await Promise.allSettled(newsPromises);
  
  let allNews: NewsItem[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const sourceName = SOURCES[index].name;
      console.log(`Successfully fetched ${result.value.length} news items from ${sourceName}`);
      allNews = [...allNews, ...result.value];
    } else {
      console.error(`Failed to fetch news from ${SOURCES[index].name}: ${result.reason}`);
    }
  });
  
  console.log(`Total news items fetched: ${allNews.length}`);
  
  // If we couldn't fetch any real news, return mock news
  if (allNews.length === 0) {
    console.log('No real news fetched, returning mock news');
    return generateMockNews();
  }
  
  // Filter out news that are likely advertisements
  const filteredNews = allNews.filter(news => {
    const lowerTitle = news.title.toLowerCase();
    return !lowerTitle.includes('sponsor') && 
           !lowerTitle.includes('publicité') && 
           !lowerTitle.includes('partenaire') &&
           !lowerTitle.includes('en ce moment');
  });
  
  console.log(`News after filtering: ${filteredNews.length}`);
  
  // Sort by date (most recent first)
  filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return filteredNews;
}
