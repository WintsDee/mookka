
import { corsHeaders } from '../fetch-media/cors.ts'

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
const RAWG_API_KEY = Deno.env.get('RAWG_API_KEY')
const GOOGLE_BOOKS_API_KEY = Deno.env.get('GOOGLE_BOOKS_API_KEY')

interface MediaDetailParams {
  type: 'film' | 'serie' | 'book' | 'game';
  id: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, id } = await req.json() as MediaDetailParams
    
    if (!type || !id) {
      throw new Error("Le type de média et l'ID sont nécessaires")
    }
    
    console.log(`Fetching media details for ${type}/${id}`);
    
    let mediaData = null;
    
    switch (type) {
      case 'film':
        const filmResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos,images`
        );
        
        if (!filmResponse.ok) {
          throw new Error(`Erreur TMDB: ${filmResponse.status}`);
        }
        
        mediaData = await filmResponse.json();
        break;
        
      case 'serie':
        const serieResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos,images`
        );
        
        if (!serieResponse.ok) {
          throw new Error(`Erreur TMDB: ${serieResponse.status}`);
        }
        
        mediaData = await serieResponse.json();
        break;
        
      case 'book':
        const bookResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_API_KEY}`
        );
        
        if (!bookResponse.ok) {
          throw new Error(`Erreur Google Books: ${bookResponse.status}`);
        }
        
        mediaData = await bookResponse.json();
        break;
        
      case 'game':
        const gameResponse = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`
        );
        
        if (!gameResponse.ok) {
          throw new Error(`Erreur RAWG: ${gameResponse.status}`);
        }
        
        mediaData = await gameResponse.json();
        break;
        
      default:
        throw new Error(`Type de média non pris en charge: ${type}`);
    }
    
    console.log(`Successfully fetched ${type}/${id}`);
    
    return new Response(JSON.stringify(mediaData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(`Error fetching ${req.url}:`, error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
