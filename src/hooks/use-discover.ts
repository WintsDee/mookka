
import { useState, useEffect, useCallback } from "react";
import { fetchDiscoverySections, fetchTrendingMedia, fetchUpcomingMedia, fetchRecommendedMedia } from "@/services/media";
import type { DiscoverySection } from "@/services/media/discovery-service";
import { MediaType } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "./use-mobile";

type TabType = MediaType | 'all';

export function useDiscover() {
  const [sections, setSections] = useState<DiscoverySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const loadSections = useCallback(async (mediaType?: TabType) => {
    try {
      setLoading(true);
      
      // Parallel fetch for different section types
      const [discoverySectionsPromise, trendingPromise, upcomingPromise, recommendedPromise] = await Promise.allSettled([
        fetchDiscoverySections(),
        fetchTrendingMedia(mediaType),
        fetchUpcomingMedia(mediaType),
        fetchRecommendedMedia(undefined, mediaType)
      ]);
      
      let allSections: DiscoverySection[] = [];
      
      // Add trending section if available
      if (trendingPromise.status === 'fulfilled' && trendingPromise.value.length > 0) {
        allSections.push({
          id: 'trending',
          title: 'Tendances',
          type: 'trending',
          mediaType: mediaType === 'all' ? undefined : mediaType as MediaType,
          items: trendingPromise.value.map(item => ({
            ...item,
            id: item.id || `trending-${Math.random().toString(36).substring(7)}`
          }))
        });
      }
      
      // Add upcoming section if available
      if (upcomingPromise.status === 'fulfilled' && upcomingPromise.value.length > 0) {
        allSections.push({
          id: 'upcoming',
          title: 'À venir',
          type: 'upcoming',
          mediaType: mediaType === 'all' ? undefined : mediaType as MediaType,
          items: upcomingPromise.value.map(item => ({
            ...item,
            id: item.id || `upcoming-${Math.random().toString(36).substring(7)}`
          }))
        });
      }
      
      // Add recommended section if available
      if (recommendedPromise.status === 'fulfilled' && recommendedPromise.value.length > 0) {
        allSections.push({
          id: 'recommended',
          title: 'Recommandés pour vous',
          type: 'recommended',
          mediaType: mediaType === 'all' ? undefined : mediaType as MediaType,
          items: recommendedPromise.value.map(item => ({
            ...item,
            id: item.id || `recommended-${Math.random().toString(36).substring(7)}`
          }))
        });
      }
      
      // Add other discovery sections if available
      if (discoverySectionsPromise.status === 'fulfilled') {
        // Filter by media type if specified
        const filteredSections = mediaType && mediaType !== 'all'
          ? discoverySectionsPromise.value.filter(section => !section.mediaType || section.mediaType === mediaType)
          : discoverySectionsPromise.value;
          
        allSections = [...allSections, ...filteredSections];
      }
      
      // Sort sections in a logical order
      const sectionOrder = ['trending', 'recommended', 'upcoming', 'popular', 'new', 'genre'];
      allSections.sort((a, b) => {
        return sectionOrder.indexOf(a.type) - sectionOrder.indexOf(b.type);
      });
      
      // Ensure all media items have an ID
      allSections = allSections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          id: item.id || `${section.id}-${Math.random().toString(36).substring(7)}`
        }))
      }));
      
      setSections(allSections);
    } catch (error) {
      console.error("Error loading discovery sections:", error);
      toast.error("Impossible de charger les découvertes");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadSections(activeTab);
      toast.success("Contenu mis à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, loadSections]);
  
  const handleTabChange = useCallback((type: TabType) => {
    setActiveTab(type);
    loadSections(type);
  }, [loadSections]);

  // Initial load
  useEffect(() => {
    loadSections();
  }, [loadSections]);

  return {
    sections,
    loading,
    refreshing,
    activeTab,
    handleRefresh,
    handleTabChange,
    isMobile
  };
}
