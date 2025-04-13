
import { load } from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { NewsItem } from './types.ts';
import { detectMediaType } from './category-detector.ts';

// Scrape web page using Cheerio
export async function scrapeWebPage(url: string, source: string): Promise<NewsItem[]> {
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
