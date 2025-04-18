
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchNews } from "@/services/news-service";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useArticle } from "./use-article";
import { useSources } from "./use-sources";
import { NewsTab, NewsPreferences } from "./types";

export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<NewsTab>("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { selectedArticle, handleArticleSelect, handleArticleClose } = useArticle();
  const { 
    sources, 
    setSources, 
    activeSource, 
    activeSources, 
    handleSourceChange, 
    handleSourcesChange 
  } = useSources();

  // Store user preferences in local storage
  const [storedPreferences, setStoredPreferences] = useLocalStorage<NewsPreferences>("news-preferences", {
    lastTab: "all",
    lastSource: null,
    lastSources: []
  });

  // Load news data
  const loadNews = useCallback(async (type?: string, forceRefresh = false) => {
    try {
      setLoading(true);
      const newsData = await fetchNews(type, forceRefresh);
      setNews(newsData);
      
      // Extract unique sources
      const uniqueSources = Array.from(new Set(newsData.map(item => item.source))).sort();
      setSources(uniqueSources);
    } catch (error) {
      console.error("Error loading news:", error);
      toast.error("Unable to load news");
    } finally {
      setLoading(false);
    }
  }, [setSources]);

  // Handle tab change
  const handleTabChange = useCallback((tab: NewsTab) => {
    setActiveTab(tab);
    setStoredPreferences(prev => ({ ...prev, lastTab: tab }));
    loadNews(tab === "all" ? undefined : tab);
  }, [loadNews, setStoredPreferences]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadNews(activeTab === "all" ? undefined : activeTab, true);
      toast.success("News updated");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, loadNews]);

  // Initialize with stored preferences
  useEffect(() => {
    if (!isInitialLoad) return;
    
    if (storedPreferences) {
      setActiveTab(storedPreferences.lastTab);
      handleSourceChange(storedPreferences.lastSource);
      handleSourcesChange(storedPreferences.lastSources || []);
      loadNews(storedPreferences.lastTab === "all" ? undefined : storedPreferences.lastTab);
    } else {
      loadNews();
    }
    
    setIsInitialLoad(false);
  }, [isInitialLoad, loadNews, storedPreferences, handleSourceChange, handleSourcesChange]);

  return {
    news,
    loading,
    refreshing,
    activeTab,
    activeSource,
    activeSources,
    sources,
    selectedArticle,
    handleTabChange,
    handleSourceChange,
    handleSourcesChange,
    handleRefresh,
    handleArticleSelect,
    handleArticleClose
  };
}
