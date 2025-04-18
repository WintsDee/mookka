
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { fetchAllNews } from './news-fetcher.ts';
import { corsHeaders } from './cors.ts';
import { NewsItem } from './types.ts';

// Cache the news results for 30 minutes
let cachedNews: NewsItem[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request for news');
    const currentTime = Date.now();
    let news: NewsItem[];
    
    // Force fetch fresh news by adding a refresh query parameter
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // Check if we need to fetch fresh news or can use cached
    if (forceRefresh || !cachedNews || (currentTime - lastFetchTime > CACHE_DURATION)) {
      console.log(`Fetching fresh news... (forceRefresh: ${forceRefresh}, hasCachedNews: ${!!cachedNews}, cacheAge: ${(currentTime - lastFetchTime) / 1000} seconds)`);
      news = await fetchAllNews();
      
      // Only update cache if we actually got some news
      if (news.length > 0) {
        console.log(`Caching ${news.length} news items`);
        cachedNews = news;
        lastFetchTime = currentTime;
      } else if (cachedNews) {
        // If fetch failed but we have cached news, use that
        console.log('Fresh fetch failed or returned no news, using cached news');
        news = cachedNews;
      } else {
        console.log('No news found, returning empty array');
        news = [];
      }
    } else {
      console.log(`Using cached news (${cachedNews.length} items, cache age: ${(currentTime - lastFetchTime) / 1000} seconds)`);
      news = cachedNews;
    }
    
    // Get type from query parameter
    const type = url.searchParams.get('type');
    
    // Filter by type if specified
    if (type && ['film', 'serie', 'book', 'game', 'general'].includes(type)) {
      console.log(`Filtering news by type: ${type}`);
      news = news.filter(item => item.category === type);
      console.log(`Filtered to ${news.length} news items`);
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
