
import { useState, useEffect, useCallback } from "react";
import { fetchNews, NewsItem } from "@/services/news-service";
import { toast } from "@/components/ui/sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Store user preferences in local storage
  const [storedPreferences, setStoredPreferences] = useLocalStorage("news-preferences", {
    lastTab: "all",
    lastSource: null as string | null
  });

  // Load news data
  const loadNews = useCallback(async (type?: string, source?: string | null, forceRefresh = false) => {
    try {
      setLoading(true);
      const newsData = await fetchNews(type === "all" ? undefined : type, forceRefresh);
      setNews(newsData);
      
      // Extract unique sources
      const uniqueSources = Array.from(new Set(newsData.map(item => item.source))).sort();
      setSources(uniqueSources);
      
      // Filter by source if needed
      if (source) {
        setActiveSource(source);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle refresh action
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadNews(activeTab === "all" ? undefined : activeTab, activeSource, true);
      toast.success("Actualités mises à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, activeSource, loadNews]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setStoredPreferences(prev => ({ ...prev, lastTab: value }));
    loadNews(value === "all" ? undefined : value, activeSource);
  }, [activeSource, loadNews, setStoredPreferences]);

  // Handle source change
  const handleSourceChange = useCallback((source: string | null) => {
    setActiveSource(source);
    setStoredPreferences(prev => ({ ...prev, lastSource: source }));
    
    // Filter news by active source
    loadNews(activeTab === "all" ? undefined : activeTab, source);
  }, [activeTab, loadNews, setStoredPreferences]);

  // Handle article selection
  const handleArticleSelect = useCallback((article: NewsItem) => {
    setSelectedArticle(article);
  }, []);

  // Handle article close
  const handleArticleClose = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  // Initial load based on stored preferences
  useEffect(() => {
    if (storedPreferences) {
      setActiveTab(storedPreferences.lastTab);
      setActiveSource(storedPreferences.lastSource);
      loadNews(
        storedPreferences.lastTab === "all" ? undefined : storedPreferences.lastTab,
        storedPreferences.lastSource
      );
    } else {
      loadNews();
    }
  }, [loadNews, storedPreferences]);

  return {
    news,
    loading,
    refreshing,
    activeTab,
    activeSource,
    sources,
    selectedArticle,
    handleTabChange,
    handleSourceChange,
    handleRefresh,
    handleArticleSelect,
    handleArticleClose
  };
};
