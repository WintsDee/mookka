
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fetchNews } from "@/services/news-service";
import { toast } from "@/components/ui/sonner";
import { useTrending } from "./use-trending";
import { useNewReleases } from "./use-new-releases";
import { useRecommendations } from "./use-recommendations";
import { DiscoverTab, DiscoverPreferences } from "./types";

export function useDiscover() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("trending");
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  
  const { trendingMedia, loadTrendingMedia } = useTrending();
  const { newReleases, newReleasesLoading, loadNewReleases } = useNewReleases();
  const { recommendations, recommendationsLoading, loadRecommendations } = useRecommendations();

  const [storedPreferences, setStoredPreferences] = useLocalStorage<DiscoverPreferences>("discover-preferences", {
    lastTab: "trending",
  });

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

  useEffect(() => {
    if (storedPreferences?.lastTab) {
      setActiveTab(storedPreferences.lastTab);
    }
    
    switch (activeTab) {
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
  }, [storedPreferences, loadTrendingMedia, loadNewReleases, loadRecommendations, loadNews, news.length, newReleases.length, recommendations.length, activeTab]);

  const handleTabChange = useCallback((tab: DiscoverTab) => {
    setActiveTab(tab);
    setStoredPreferences(prev => ({ ...prev, lastTab: tab }));
    
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
