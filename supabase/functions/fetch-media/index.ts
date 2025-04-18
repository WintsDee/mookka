
import { corsHeaders } from './cors-headers.ts';
import { handleTMDBMedia } from './api-handlers/tmdb-handler.ts';
import { handleGoogleBooks } from './api-handlers/google-books-handler.ts';
import { handleRAWGGames } from './api-handlers/rawg-handler.ts';
import { filterAdultContent } from './filters/adult-content-filter.ts';
import { sortSearchResults } from './sorting/search-results-sorter.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, query, id } = await req.json();
    let data;

    switch (type) {
      case 'film':
      case 'serie':
        data = await handleTMDBMedia(type, query, id);
        break;
      case 'book':
        data = await handleGoogleBooks(query, id);
        if (!id) {
          data = filterAdultContent(data, type);
          data = sortSearchResults(data, type, query);
        }
        break;
      case 'game':
        data = await handleRAWGGames(query, id);
        if (!id) {
          data = sortSearchResults(data, type, query);
        }
        break;
      default:
        throw new Error('Type de média non pris en charge');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in fetch-media function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
