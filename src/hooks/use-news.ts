
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchNews, NewsItem } from "@/services/news-service";
import { toast } from "@/components/ui/sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const useNews = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]); // Stocke toutes les actualités non filtrées
  const [news, setNews] = useState<NewsItem[]>([]); // Actualités filtrées pour l'affichage
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
  
  // Load news data from API
  const loadNews = useCallback(async (type?: string, forceRefresh = false) => {
    try {
      setLoading(true);
      const newsData = await fetchNews(type === "all" ? undefined : type, forceRefresh);
      
      // Store all unfiltered news
      setAllNews(newsData);
      
      // Extract unique sources
      const uniqueSources = Array.from(new Set(newsData.map(item => item.source))).sort();
      setSources(uniqueSources);
      
      // Update displayed news based on current filter
      applyFilters(newsData, activeSource);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  }, [activeSource]);
  
  // Apply both category and source filters to news
  const applyFilters = useCallback((newsData: NewsItem[], source: string | null) => {
    let filtered = [...newsData];
    
    // Apply source filter if needed
    if (source) {
      filtered = filtered.filter(item => item.source === source);
    }
    
    setNews(filtered);
  }, []);

  // Handle refresh action
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

  // Handle tab change (category filter)
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setStoredPreferences(prev => ({ ...prev, lastTab: value }));
    loadNews(value === "all" ? undefined : value);
  }, [loadNews, setStoredPreferences]);

  // Handle source change
  const handleSourceChange = useCallback((source: string | null) => {
    setActiveSource(source);
    setStoredPreferences(prev => ({ ...prev, lastSource: source }));
    
    // Apply filters to already loaded news
    applyFilters(allNews, source);
  }, [allNews, applyFilters, setStoredPreferences]);

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
        storedPreferences.lastTab === "all" ? undefined : storedPreferences.lastTab
      );
    } else {
      loadNews();
    }
  }, [loadNews, storedPreferences]);
  
  // Apply source filter when activeSource changes
  useEffect(() => {
    if (allNews.length > 0) {
      applyFilters(allNews, activeSource);
    }
  }, [activeSource, allNews, applyFilters]);

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
