
import { SOURCES } from './sources.ts';
import { parseRSSFeed } from './rss-parser.ts';
import { scrapeWebPage } from './web-scraper.ts';
import { generateMockNews } from './mock-generator.ts';
import { NewsItem } from './types.ts';

// Main function to fetch news
export async function fetchAllNews(): Promise<NewsItem[]> {
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
