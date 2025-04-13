
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { fetchAllNews } from './news-fetcher.ts';
import { corsHeaders } from './cors.ts';
import { NewsItem } from './types.ts';

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
