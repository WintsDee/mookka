
// Si ce n'est pas déjà fait, mise à jour de la fonction pour inclure les informations de DLC et de temps de jeu
if (type === 'game' && id) {
  // Fetch game DLCs
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
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des DLC:", error);
  }
}
