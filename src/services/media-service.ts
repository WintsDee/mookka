
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";

export async function searchMedia(type: MediaType, query: string): Promise<any> {
  try {
    // 1. D'abord, rechercher dans la base de données Mookka
    const { data: localMedia, error: localError } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .ilike('title', `%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);
    
    if (localError) {
      console.error("Erreur lors de la recherche locale de médias:", localError);
    }
    
    // 2. Ensuite, rechercher via l'API externe
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (apiError) {
      console.error("Erreur lors de la recherche de médias:", apiError);
      throw apiError;
    }
    
    // 3. Traiter les résultats de l'API
    let apiResults: any[] = [];
    if (apiData) {
      switch (type) {
        case 'film':
          apiResults = apiData.results?.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            type,
            coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
            year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
            rating: item.vote_average || null,
            popularity: item.popularity || 0,
            externalData: item
          })) || [];
          
          // Tri par popularité pour TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'serie':
          apiResults = apiData.results?.map((item: any) => ({
            id: item.id.toString(),
            title: item.name,
            type,
            coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
            year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
            rating: item.vote_average || null,
            popularity: item.popularity || 0,
            externalData: item
          })) || [];
          
          // Tri par popularité pour TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'book':
          apiResults = apiData.items?.map((item: any) => {
            const publishedDate = item.volumeInfo?.publishedDate;
            const publishedYear = publishedDate ? parseInt(publishedDate.substring(0, 4)) : null;
            const categories = item.volumeInfo?.categories || [];
            const title = item.volumeInfo?.title || 'Sans titre';
            const description = item.volumeInfo?.description || '';
            
            // Calculer un score de pertinence basé sur le contenu
            let relevanceScore = 0;
            
            // Liste des catégories préférées (divertissement)
            const preferredCategories = [
              'fiction', 'roman', 'manga', 'bande dessinée', 'bd', 'comics', 'graphic novel',
              'fantasy', 'sci-fi', 'science fiction', 'thriller', 'mystery', 'policier', 'adventure',
              'aventure', 'young adult', 'jeunesse', 'fantastique', 'horreur', 'horror'
            ];
            
            // Liste des catégories à éviter (académiques, essais, etc.)
            const avoidCategories = [
              'academic', 'textbook', 'manuel', 'thesis', 'thèse', 'dissertation', 'essay', 
              'essai', 'biography', 'biographie', 'self-help', 'développement personnel',
              'business', 'management', 'education', 'reference', 'science', 'mathematics',
              'mathématiques', 'philosophy', 'philosophie', 'religion', 'political', 'politique',
              'economics', 'économie', 'medical', 'médical', 'law', 'droit', 'computer science'
            ];
            
            // Vérifier les catégories
            for (const category of categories) {
              const lowerCategory = category.toLowerCase();
              
              // Bonus pour les catégories préférées
              for (const preferred of preferredCategories) {
                if (lowerCategory.includes(preferred)) {
                  relevanceScore += 20;
                  break;
                }
              }
              
              // Pénalité pour les catégories à éviter
              for (const avoid of avoidCategories) {
                if (lowerCategory.includes(avoid)) {
                  relevanceScore -= 30;
                  break;
                }
              }
            }
            
            // Vérifier le titre et la description pour les mots-clés pertinents
            const lowerTitle = title.toLowerCase();
            const lowerDescription = description.toLowerCase();
            const contentText = `${lowerTitle} ${lowerDescription}`;
            
            for (const preferred of preferredCategories) {
              if (contentText.includes(preferred)) {
                relevanceScore += 10;
              }
            }
            
            for (const avoid of avoidCategories) {
              if (contentText.includes(avoid)) {
                relevanceScore -= 15;
              }
            }
            
            // Bonus pour les livres avec des images de couverture (généralement plus pertinents)
            if (item.volumeInfo?.imageLinks?.thumbnail) {
              relevanceScore += 15;
            }
            
            // Bonus pour les livres avec des avis (généralement plus pertinents)
            if (item.volumeInfo?.averageRating) {
              relevanceScore += item.volumeInfo.averageRating * 5;
            }
            
            if (item.volumeInfo?.ratingsCount) {
              relevanceScore += Math.min(item.volumeInfo.ratingsCount / 10, 20);
            }
            
            // Bonus pour les livres récents (mais pas trop non plus pour les classiques)
            if (publishedYear) {
              if (publishedYear > 2000) {
                relevanceScore += Math.min((publishedYear - 2000) / 5, 15);
              } else if (publishedYear < 1900) {
                // Bonus pour les classiques
                relevanceScore += 10;
              }
            }
            
            return {
              id: item.id,
              title: title,
              type,
              coverImage: item.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
              year: publishedYear,
              author: item.volumeInfo?.authors ? item.volumeInfo.authors[0] : null,
              popularity: relevanceScore,
              categories: categories,
              externalData: item
            };
          }) || [];
          
          // Filtrer les livres avec un score de pertinence trop bas
          apiResults = apiResults.filter(item => item.popularity > -20);
          
          // Tri par score de pertinence pour Google Books
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'game':
          apiResults = apiData.results?.map((item: any) => {
            const releaseYear = item.released ? parseInt(item.released.substring(0, 4)) : null;
            
            // Calcul d'un score de pertinence amélioré pour les jeux
            let gameRelevance = 0;
            
            // Prioriser les jeux avec des notes élevées
            if (item.rating) {
              gameRelevance += item.rating * 10; // 0-50 points basé sur la notation 0-5
            }
            
            // Prioriser les jeux populaires
            if (item.ratings_count) {
              gameRelevance += Math.min(item.ratings_count / 100, 40); // Max 40 points
            }
            
            // Bonus pour les jeux récents
            if (releaseYear) {
              if (releaseYear >= 2015) {
                gameRelevance += Math.min((releaseYear - 2015) * 2, 20); // Max 20 points
              }
            }
            
            // Bonus pour les jeux avec des images
            if (item.background_image) {
              gameRelevance += 15;
            }
            
            // Bonus pour les jeux avec beaucoup de plateformes (généralement plus connus)
            if (item.platforms && Array.isArray(item.platforms)) {
              gameRelevance += Math.min(item.platforms.length * 2, 20); // Max 20 points
            }
            
            return {
              id: item.id.toString(),
              title: item.name,
              type,
              coverImage: item.background_image || '/placeholder.svg',
              year: releaseYear,
              rating: item.rating || null,
              popularity: gameRelevance,
              externalData: item
            };
          }) || [];
          
          // Tri par pertinence pour RAWG
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
      }
    }
    
    // 4. Filtrer plus strictement les contenus inappropriés
    apiResults = filterAdultContent(apiResults);
    
    // 5. Fusionner les résultats (base de données + API) en évitant les doublons
    let mergedResults: any[] = [];
    
    // D'abord, ajouter les résultats locaux (Mookka)
    if (localMedia && localMedia.length > 0) {
      mergedResults = localMedia.map((item) => ({
        id: item.id,
        externalId: item.external_id,
        title: item.title,
        type: item.type,
        coverImage: item.cover_image,
        year: item.year,
        rating: item.rating,
        genres: item.genres,
        description: item.description,
        author: item.author,
        director: item.director,
        fromDatabase: true // Marquer comme venant de la base de données
      }));
    }
    
    // Ensuite, ajouter les résultats de l'API en évitant les doublons
    const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
    
    for (const apiItem of apiResults) {
      if (!existingExternalIds.has(apiItem.id)) {
        mergedResults.push(apiItem);
      }
    }
    
    // 6. Trier les résultats finaux par pertinence
    mergedResults.sort((a, b) => {
      // Donner priorité aux médias de la base de données
      if (a.fromDatabase && !b.fromDatabase) return -1;
      if (!a.fromDatabase && b.fromDatabase) return 1;
      
      // Ensuite, trier par popularité calculée ou rating
      const aPopularity = a.popularity || a.rating || 0;
      const bPopularity = b.popularity || b.rating || 0;
      return bPopularity - aPopularity;
    });
    
    return { results: mergedResults };
  } catch (error) {
    console.error("Erreur dans searchMedia:", error);
    throw error;
  }
}

function filterAdultContent(mediaList: any[]): any[] {
  const adultContentKeywords = [
    'xxx', 'erotic', 'érotique', 'adult', 'adulte', 'sex', 'sexe', 'sexy', 'porn', 'porno',
    'pornographique', 'nude', 'nu', 'nue', 'naked', 'mature', 'kinky', 'fetish', 'fétiche',
    'bdsm', 'kamasutra', 'nudité', 'explicit', 'explicite', 'hot', 'sensual', 'sensuel',
    'seduction', 'séduction'
  ];
  
  return mediaList.filter(media => {
    const title = (media.title || '').toLowerCase();
    const description = (media.description || '').toLowerCase();
    const genres = Array.isArray(media.genres) 
      ? media.genres.map((g: string) => g.toLowerCase()).join(' ') 
      : '';
    
    const contentText = `${title} ${description} ${genres}`;
    
    // Vérifier si le contenu contient des mots-clés inappropriés
    return !adultContentKeywords.some(keyword => contentText.includes(keyword));
  });
}

export async function getMediaById(type: MediaType, id: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, id }
    });

    if (error) {
      console.error("Erreur lors de la récupération du média:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur dans getMediaById:", error);
    throw error;
  }
}

export async function addMediaToLibrary(media: any, type: MediaType): Promise<Media> {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
    }
    
    // Formater les données du média selon le type
    let formattedMedia: any = {
      external_id: media.id.toString() || '',
      title: '',
      type: type,
      genres: [],
    };

    switch (type) {
      case 'film':
        formattedMedia = {
          ...formattedMedia,
          title: media.title || '',
          cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
          year: media.release_date ? parseInt(media.release_date.substring(0, 4)) : null,
          rating: media.vote_average || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.overview || '',
          duration: media.runtime ? `${media.runtime} min` : '',
          director: media.director || '',
        };
        break;
      case 'serie':
        formattedMedia = {
          ...formattedMedia,
          title: media.name || '',
          cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
          year: media.first_air_date ? parseInt(media.first_air_date.substring(0, 4)) : null,
          rating: media.vote_average || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.overview || '',
          duration: media.number_of_seasons ? `${media.number_of_seasons} saison(s)` : '',
        };
        break;
      case 'book':
        formattedMedia = {
          ...formattedMedia,
          title: media.volumeInfo?.title || '',
          cover_image: media.volumeInfo?.imageLinks?.thumbnail || null,
          year: media.volumeInfo?.publishedDate ? parseInt(media.volumeInfo.publishedDate.substring(0, 4)) : null,
          genres: media.volumeInfo?.categories || [],
          description: media.volumeInfo?.description || '',
          author: media.volumeInfo?.authors ? media.volumeInfo.authors.join(', ') : '',
        };
        break;
      case 'game':
        formattedMedia = {
          ...formattedMedia,
          title: media.name || '',
          cover_image: media.background_image || null,
          year: media.released ? parseInt(media.released.substring(0, 4)) : null,
          rating: media.rating || null,
          genres: media.genres ? media.genres.map((g: any) => g.name) : [],
          description: media.description_raw || '',
          publisher: media.publishers && media.publishers.length > 0 ? media.publishers[0].name : '',
          platform: media.platforms ? media.platforms.map((p: any) => p.platform.name).join(', ') : '',
        };
        break;
    }

    // D'abord vérifier si le média existe déjà dans la base de données
    const { data: existingMedia, error: fetchError } = await supabase
      .from('media')
      .select('id')
      .eq('external_id', media.id.toString())
      .eq('type', type)
      .maybeSingle();

    let mediaId;

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 signifie "no rows returned"
      console.error("Erreur lors de la vérification du média:", fetchError);
      throw fetchError;
    }

    if (existingMedia) {
      // Le média existe déjà, utiliser son ID
      mediaId = existingMedia.id;
    } else {
      // Le média n'existe pas, l'insérer
      const { data: newMedia, error: insertError } = await supabase
        .from('media')
        .insert(formattedMedia)
        .select('id')
        .single();

      if (insertError) {
        console.error("Erreur lors de l'insertion du média:", insertError);
        throw insertError;
      }

      mediaId = newMedia.id;
    }

    // Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
    const { data: existingUserMedia, error: userMediaCheckError } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (userMediaCheckError && userMediaCheckError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média de l'utilisateur:", userMediaCheckError);
      throw userMediaCheckError;
    }
    
    if (existingUserMedia) {
      // L'utilisateur a déjà ce média, renvoyer les détails
      return {
        id: mediaId,
        type: type,
        title: formattedMedia.title,
        coverImage: formattedMedia.cover_image,
        year: formattedMedia.year,
        rating: formattedMedia.rating,
        genres: formattedMedia.genres,
        description: formattedMedia.description,
        status: 'to-watch' as const,
        duration: formattedMedia.duration,
        director: formattedMedia.director,
        author: formattedMedia.author,
        publisher: formattedMedia.publisher,
        platform: formattedMedia.platform
      };
    }

    // Ajouter l'entrée dans user_media
    const { data: userMedia, error: userMediaInsertError } = await supabase
      .from('user_media')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        status: 'to-watch'
      })
      .select('*')
      .single();

    if (userMediaInsertError) {
      console.error("Erreur lors de l'ajout du média à la bibliothèque:", userMediaInsertError);
      throw userMediaInsertError;
    }

    return {
      id: mediaId,
      type: type,
      title: formattedMedia.title,
      coverImage: formattedMedia.cover_image,
      year: formattedMedia.year,
      rating: formattedMedia.rating,
      genres: formattedMedia.genres,
      description: formattedMedia.description,
      status: userMedia.status as 'to-watch' | 'watching' | 'completed',
      duration: formattedMedia.duration,
      director: formattedMedia.director,
      author: formattedMedia.author,
      publisher: formattedMedia.publisher,
      platform: formattedMedia.platform
    };
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

// Récupérer les médias de la bibliothèque de l'utilisateur
export async function getUserMediaLibrary(): Promise<Media[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_media')
      .select(`
        id,
        status,
        added_at,
        user_rating,
        notes,
        media:media_id (
          id,
          title,
          type,
          year,
          rating,
          genres,
          description,
          cover_image,
          duration,
          director,
          author,
          publisher,
          platform
        )
      `)
      .eq('user_id', user.user.id)
      .order('added_at', { ascending: false });
      
    if (error) {
      console.error("Erreur lors de la récupération de la bibliothèque:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item) => ({
      id: item.media.id,
      title: item.media.title,
      type: item.media.type as MediaType,
      coverImage: item.media.cover_image,
      year: item.media.year,
      rating: item.media.rating,
      userRating: item.user_rating,
      genres: item.media.genres,
      description: item.media.description,
      status: (item.status || 'to-watch') as 'to-watch' | 'watching' | 'completed',
      addedAt: item.added_at,
      notes: item.notes,
      duration: item.media.duration,
      director: item.media.director,
      author: item.media.author,
      publisher: item.media.publisher,
      platform: item.media.platform
    }));
  } catch (error) {
    console.error("Erreur dans getUserMediaLibrary:", error);
    throw error;
  }
}

// Mettre à jour le statut d'un média dans la bibliothèque
export async function updateMediaStatus(mediaId: string, status: 'to-watch' | 'watching' | 'completed'): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .update({ status })
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans updateMediaStatus:", error);
    throw error;
  }
}

// Supprimer un média de la bibliothèque
export async function removeMediaFromLibrary(mediaId: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .delete()
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la suppression du média:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans removeMediaFromLibrary:", error);
    throw error;
  }
}
