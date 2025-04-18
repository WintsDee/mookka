
import { useState, useCallback } from "react";
import { searchMedia } from "@/services/media";
import { toast } from "@/components/ui/sonner";
import { Media } from "@/types";

export function useNewReleases() {
  const [newReleases, setNewReleases] = useState<Media[]>([]);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);

  const loadNewReleases = useCallback(async () => {
    try {
      setNewReleasesLoading(true);
      
      const filmPromise = searchMedia("film", "nouveauté 2025");
      const seriePromise = searchMedia("serie", "nouvelle saison");
      const bookPromise = searchMedia("book", "nouveau roman");
      const gamePromise = searchMedia("game", "nouveau jeu");
      
      const [filmResults, serieResults, bookResults, gameResults] = await Promise.all([
        filmPromise, seriePromise, bookPromise, gamePromise
      ]);
      
      const combinedResults = [
        ...(filmResults.results?.slice(0, 5) || []),
        ...(serieResults.results?.slice(0, 5) || []),
        ...(bookResults.results?.slice(0, 5) || []),
        ...(gameResults.results?.slice(0, 5) || [])
      ].sort(() => Math.random() - 0.5).slice(0, 10);
      
      setNewReleases(combinedResults);
    } catch (error) {
      console.error("Erreur lors du chargement des nouveautés:", error);
      toast.error("Impossible de charger les nouveautés");
    } finally {
      setNewReleasesLoading(false);
    }
  }, []);

  return {
    newReleases,
    newReleasesLoading,
    loadNewReleases
  };
}
