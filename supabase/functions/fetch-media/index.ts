
// Si ce n'est pas déjà fait, mise à jour de la fonction pour inclure les informations de DLC et de temps de jeu
if (type === 'game' && id) {
  // Vérifier si nous avons déjà ces DLCs en base de données
  const { data: existingDlcs, error: dlcError } = await supabase
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
    const dlcsUrl = `https://api.rawg.io/api/games/${id}/additions?key=${apiKey}&language=fr`;
    try {
      const dlcsResponse = await fetch(dlcsUrl);
      const dlcsData = await dlcsResponse.json();
      
      // Ajouter les informations de DLC au retour
      if (dlcsData.results && dlcsData.results.length > 0) {
        data.dlcs = dlcsData.results.map((dlc: any) => ({
          id: dlc.id,
          name: dlc.name,
          description: dlc.description,
          release_date: dlc.released,
          cover_image: dlc.background_image
        }));
        
        // Stocker les DLCs en base de données pour une utilisation future
        try {
          const dlcsToInsert = data.dlcs.map((dlc: any) => ({
            name: dlc.name,
            description: dlc.description,
            release_date: dlc.release_date,
            cover_image: dlc.cover_image,
            game_id: id
          }));
          
          // Utiliser EdgeRuntime.waitUntil pour ne pas bloquer la réponse
          EdgeRuntime.waitUntil(
            supabase.from('game_dlcs').upsert(dlcsToInsert)
          );
        } catch (insertError) {
          console.error("Erreur lors de l'insertion des DLCs:", insertError);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des DLC:", error);
    }
  }
}
