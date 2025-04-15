import { useState, useEffect, useCallback } from "react";
import { fetchNews, NewsItem, NewsFilter } from "@/services/news-service";
import { toast } from "@/components/ui/sonner";
import { useLocalStorage } from '@/hooks/use-local-storage';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState<any>({});
  
  // User preferences
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSource, setSelectedSource] = useLocalStorage<string | null>("news_selected_source", null);
  const [availableSources, setAvailableSources] = useState<string[]>([]);

  // Load news with filters
  const loadNews = useCallback(async (filters?: NewsFilter, forceRefresh = false) => {
    try {
      setLoading(true);
      const { news: newsData, meta: metaData } = await fetchNews(filters, forceRefresh);
      setNews(newsData);
      setMeta(metaData);
      
      // Extract all available sources for filtering
      if (newsData.length > 0) {
        const sources = new Set<string>();
        newsData.forEach(item => {
          if (item.source) {
            sources.add(item.source);
          }
        });
        setAvailableSources(Array.from(sources).sort());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh news
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const filters: NewsFilter = {};
      
      if (activeTab !== "all") {
        filters.type = activeTab as any;
      }
      
      if (selectedSource) {
        filters.source = selectedSource;
      }
      
      await loadNews(filters, true);
      toast.success("Actualités mises à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, selectedSource, loadNews]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    const filters: NewsFilter = {};
    
    if (value !== "all") {
      filters.type = value as any;
    }
    
    if (selectedSource) {
      filters.source = selectedSource;
    }
    
    loadNews(filters);
  }, [selectedSource, loadNews]);

  // Handle source change
  const handleSourceChange = useCallback((source: string | null) => {
    setSelectedSource(source);
    
    const filters: NewsFilter = {};
    
    if (activeTab !== "all") {
      filters.type = activeTab as any;
    }
    
    if (source) {
      filters.source = source;
    }
    
    loadNews(filters);
  }, [activeTab, setSelectedSource, loadNews]);

  // Load news on initial mount
  useEffect(() => {
    const filters: NewsFilter = {};
    
    if (activeTab !== "all") {
      filters.type = activeTab as any;
    }
    
    if (selectedSource) {
      filters.source = selectedSource;
    }
    
    loadNews(filters);
  }, [loadNews, activeTab, selectedSource]);

  return {
    news,
    loading,
    refreshing,
    activeTab,
    meta,
    selectedSource,
    availableSources,
    handleTabChange,
    handleSourceChange,
    handleRefresh
  };
};
