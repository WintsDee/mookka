
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// En-têtes CORS pour permettre les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction principale du serveur
serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Extraire les paramètres de la requête
    const { type, id, action, query, page = 1 } = await req.json();
    
    if (!type) {
      throw new Error("Le paramètre 'type' est requis");
    }

    // Initialiser le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Requête reçue pour ${type}, action: ${action || 'details'}, id: ${id || 'non spécifié'}`);
    
    // Récupérer les clés API appropriées selon le type de média
    let apiKey = '';
    let baseUrl = '';
    
    switch (type) {
      case 'film':
      case 'serie':
        apiKey = Deno.env.get('TMDB_API_KEY') || '';
        baseUrl = 'https://api.themoviedb.org/3';
        break;
      case 'book':
        apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') || '';
        baseUrl = 'https://www.googleapis.com/books/v1';
        break;
      case 'game':
        apiKey = Deno.env.get('RAWG_API_KEY') || '';
        baseUrl = 'https://api.rawg.io/api';
        break;
      default:
        throw new Error(`Type de média non pris en charge: ${type}`);
    }

    // Variables pour stocker les résultats de l'API
    let apiUrl = '';
    let data = null;

    // Construire l'URL API en fonction de l'action
    if (action === 'search') {
      // Recherche de médias
      switch (type) {
        case 'film':
          apiUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=fr`;
          break;
        case 'serie':
          apiUrl = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=fr`;
          break;
        case 'book':
          apiUrl = `${baseUrl}/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=20&startIndex=${(page - 1) * 20}`;
          break;
        case 'game':
          apiUrl = `${baseUrl}/games?key=${apiKey}&search=${encodeURIComponent(query)}&page=${page}`;
          break;
      }
    } else if (action === 'trending') {
      // Médias tendance
      switch (type) {
        case 'film':
          apiUrl = `${baseUrl}/trending/movie/week?api_key=${apiKey}&language=fr`;
          break;
        case 'serie':
          apiUrl = `${baseUrl}/trending/tv/week?api_key=${apiKey}&language=fr`;
          break;
        case 'book':
          // Pour les livres, utiliser les livres populaires ou recommandés
          apiUrl = `${baseUrl}/volumes?q=subject:bestseller&key=${apiKey}&maxResults=20&orderBy=relevance`;
          break;
        case 'game':
          apiUrl = `${baseUrl}/games?key=${apiKey}&ordering=-metacritic&page_size=20`;
          break;
      }
    } else if (action === 'similar' && id) {
      // Médias similaires
      switch (type) {
        case 'film':
          apiUrl = `${baseUrl}/movie/${id}/similar?api_key=${apiKey}&language=fr`;
          break;
        case 'serie':
          apiUrl = `${baseUrl}/tv/${id}/similar?api_key=${apiKey}&language=fr`;
          break;
        case 'book':
          // Pour les livres, rechercher des livres du même auteur ou genre
          apiUrl = `${baseUrl}/volumes/${id}/related?key=${apiKey}`;
          break;
        case 'game':
          apiUrl = `${baseUrl}/games/${id}/suggested?key=${apiKey}`;
          break;
      }
    } else if (id) {
      // Détails d'un média spécifique
      switch (type) {
        case 'film':
          apiUrl = `${baseUrl}/movie/${id}?api_key=${apiKey}&language=fr&append_to_response=credits,videos,reviews`;
          break;
        case 'serie':
          apiUrl = `${baseUrl}/tv/${id}?api_key=${apiKey}&language=fr&append_to_response=credits,videos,reviews,seasons`;
          break;
        case 'book':
          apiUrl = `${baseUrl}/volumes/${id}?key=${apiKey}`;
          break;
        case 'game':
          apiUrl = `${baseUrl}/games/${id}?key=${apiKey}`;
          break;
      }
    } else {
      throw new Error("Paramètres d'action invalides");
    }

    console.log(`Appel API: ${apiUrl}`);

    // Effectuer l'appel API
    const response = await fetch(apiUrl);
    data = await response.json();

    // Si nous avons des détails pour un jeu et que nous avons un ID, récupérer les DLCs
    if (type === 'game' && id && !action) {
      // Vérifier si nous avons déjà ces DLCs en base de données
      const { data: existingDlcs, error: dlcError } = await supabaseClient
        .from('game_dlcs')
        .select('*')
        .eq('game_id', id);
        
      if (dlcError) {
        console.error("Erreur lors de la recherche des DLCs existants:", dlcError);
      }
      
      // Si nous avons déjà des DLCs en base, utiliser ceux-là pour éviter une requête API
      if (existingDlcs && existingDlcs.length > 0) {
        data.dlcs = existingDlcs.map((dlc) => ({
          id: dlc.id,
          name: dlc.name,
          description: dlc.description,
          release_date: dlc.release_date,
          cover_image: dlc.cover_image
        }));
      } else {
        // Sinon, faire une requête à l'API pour récupérer les DLCs
        const dlcsUrl = `${baseUrl}/games/${id}/additions?key=${apiKey}&language=fr`;
        try {
          const dlcsResponse = await fetch(dlcsUrl);
          const dlcsData = await dlcsResponse.json();
          
          // Ajouter les informations de DLC au retour
          if (dlcsData.results && dlcsData.results.length > 0) {
            data.dlcs = dlcsData.results.map((dlc) => ({
              id: dlc.id,
              name: dlc.name,
              description: dlc.description,
              release_date: dlc.released,
              cover_image: dlc.background_image
            }));
            
            // Stocker les DLCs en base de données pour une utilisation future
            try {
              const dlcsToInsert = data.dlcs.map((dlc) => ({
                name: dlc.name,
                description: dlc.description,
                release_date: dlc.release_date,
                cover_image: dlc.cover_image,
                game_id: id
              }));
              
              await supabaseClient.from('game_dlcs').upsert(dlcsToInsert);
            } catch (insertError) {
              console.error("Erreur lors de l'insertion des DLCs:", insertError);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des DLC:", error);
        }
      }
    }

    // Retourner les résultats avec les en-têtes CORS
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur dans la fonction fetch-media:", error);
    
    // Retourner l'erreur avec les en-têtes CORS
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
