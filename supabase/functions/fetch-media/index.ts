
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { MediaType } from "./types.ts";
import { fetchTMDBData } from "./api/tmdb.ts";
import { fetchGoogleBooksData } from "./api/google-books.ts";
import { fetchRAWGData } from "./api/rawg.ts";
import { enrichSerieSeasons } from "./utils/serie-enrichment.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { type, query, id } = await req.json()
    let data;

    switch (type) {
      case 'film':
      case 'serie':
        const tmdbApiKey = Deno.env.get('TMDB_API_KEY') ?? '';
        data = await fetchTMDBData(type, id, query, tmdbApiKey);
        
        if (type === 'serie' && id && data.seasons) {
          await enrichSerieSeasons(data, id, tmdbApiKey);
        }
        break;

      case 'book':
        const googleBooksApiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? '';
        data = await fetchGoogleBooksData(id, query, googleBooksApiKey);
        break;

      case 'game':
        const rawgApiKey = Deno.env.get('RAWG_API_KEY') ?? '';
        data = await fetchRAWGData(id, query, rawgApiKey);
        break;

      default:
        throw new Error('Unsupported media type');
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

