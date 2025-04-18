
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/sonner";
import { fetchNews } from "@/services/news-service";
import { searchMedia } from "@/services/media";
import { Media, MediaType } from "@/types";

type DiscoverTab = "trending" | "nouveautes" | "recommandations" | "actualites";

interface TrendingMedia {
  type: MediaType;
  items: Media[];
  loading: boolean;
}

export function useDiscover() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("trending");
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [trendingMedia, setTrendingMedia] = useState<TrendingMedia[]>([
    { type: "film", items: [], loading: true },
    { type: "serie", items: [], loading: true }, 
    { type: "book", items: [], loading: true },
    { type: "game", items: [], loading: true }
  ]);
  const [newReleases, setNewReleases] = useState<Media[]>([]);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  // Stocker les préférences dans le localStorage
  const [storedPreferences, setStoredPreferences] = useLocalStorage("discover-preferences", {
    lastTab: "trending" as DiscoverTab,
  });

  // Chargement des tendances pour chaque type de média
  const loadTrendingMedia = useCallback(async () => {
    const mediaTypes: MediaType[] = ["film", "serie", "book", "game"];
    
    for (const type of mediaTypes) {
      try {
        const { results } = await searchMedia(type, "trending");
        
        // Mettre à jour ce type de média spécifique
        setTrendingMedia(prev => 
          prev.map(item => 
            item.type === type ? { ...item, items: results.slice(0, 8), loading: false } : item
          )
        );
      } catch (error) {
        console.error(`Erreur lors du chargement des tendances pour ${type}:`, error);
        setTrendingMedia(prev => 
          prev.map(item => 
            item.type === type ? { ...item, loading: false } : item
          )
        );
      }
    }
  }, []);

  // Chargement des nouveautés
  const loadNewReleases = useCallback(async () => {
    try {
      setNewReleasesLoading(true);
      
      // Recherche de contenus récents avec des termes appropriés pour chaque type
      const filmPromise = searchMedia("film", "nouveauté 2025");
      const seriePromise = searchMedia("serie", "nouvelle saison");
      const bookPromise = searchMedia("book", "nouveau roman");
      const gamePromise = searchMedia("game", "nouveau jeu");
      
      const [filmResults, serieResults, bookResults, gameResults] = await Promise.all([
        filmPromise, seriePromise, bookPromise, gamePromise
      ]);
      
      // Combiner et mélanger les résultats
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

  // Chargement des recommandations (simulées pour cet exemple)
  const loadRecommendations = useCallback(async () => {
    try {
      setRecommendationsLoading(true);
      
      // Dans un cas réel, ceci pourrait provenir d'un algorithme de recommandation
      // Pour cet exemple, on utilise une recherche avec des termes populaires
      const { results } = await searchMedia("film", "recommandé");
      setRecommendations(results?.slice(0, 12) || []);
    } catch (error) {
      console.error("Erreur lors du chargement des recommandations:", error);
      toast.error("Impossible de charger les recommandations");
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  // Chargement des actualités
  const loadNews = useCallback(async () => {
    try {
      setNewsLoading(true);
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Chargement initial des données lors du montage du composant
  useEffect(() => {
    // Restaurer l'onglet actif à partir du localStorage
    if (storedPreferences && storedPreferences.lastTab) {
      setActiveTab(storedPreferences.lastTab);
    }
    
    // Charger les données initiales pour l'onglet actif
    switch (activeTab) {
      case "trending":
        loadTrendingMedia();
        break;
      case "nouveautes":
        loadNewReleases();
        break;
      case "recommandations":
        loadRecommendations();
        break;
      case "actualites":
        loadNews();
        break;
    }
  }, [storedPreferences, loadTrendingMedia, loadNewReleases, loadRecommendations, loadNews, activeTab]);

  // Gérer le changement d'onglet
  const handleTabChange = useCallback((tab: DiscoverTab) => {
    setActiveTab(tab);
    setStoredPreferences(prev => ({ ...prev, lastTab: tab }));
    
    // Charger les données appropriées pour le nouvel onglet
    switch (tab) {
      case "trending":
        if (trendingMedia.some(item => item.items.length === 0)) {
          loadTrendingMedia();
        }
        break;
      case "nouveautes":
        if (newReleases.length === 0) {
          loadNewReleases();
        }
        break;
      case "recommandations":
        if (recommendations.length === 0) {
          loadRecommendations();
        }
        break;
      case "actualites":
        if (news.length === 0) {
          loadNews();
        }
        break;
    }
  }, [loadTrendingMedia, loadNewReleases, loadRecommendations, loadNews, news.length, newReleases.length, recommendations.length, setStoredPreferences, trendingMedia]);

  // Rafraîchir les données de l'onglet actif
  const handleRefresh = useCallback(async () => {
    switch (activeTab) {
      case "trending":
        await loadTrendingMedia();
        break;
      case "nouveautes":
        await loadNewReleases();
        break;
      case "recommandations":
        await loadRecommendations();
        break;
      case "actualites":
        await loadNews();
        break;
    }
    toast.success("Contenu mis à jour");
  }, [activeTab, loadTrendingMedia, loadNewReleases, loadRecommendations, loadNews]);

  return {
    activeTab,
    trendingMedia,
    newReleases,
    newReleasesLoading,
    recommendations,
    recommendationsLoading,
    news,
    newsLoading,
    handleTabChange,
    handleRefresh
  };
}
