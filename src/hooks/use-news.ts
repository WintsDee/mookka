
import { useState, useEffect, useCallback } from "react";
import { fetchNews, NewsItem } from "@/services/news-service";
import { toast } from "@/components/ui/sonner";

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const loadNews = useCallback(async (type?: string, forceRefresh = false) => {
    try {
      setLoading(true);
      const newsData = await fetchNews(type === "all" ? undefined : type, forceRefresh);
      setNews(newsData);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadNews(activeTab === "all" ? undefined : activeTab, true);
      toast.success("Actualités mises à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, loadNews]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    if (value === "all") {
      loadNews();
    } else {
      loadNews(value);
    }
  }, [loadNews]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    news,
    loading,
    refreshing,
    activeTab,
    handleTabChange,
    handleRefresh
  };
};
