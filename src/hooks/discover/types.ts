
import { Media, MediaType } from "@/types";

export type { MediaType };
export type DiscoverTab = "trending" | "nouveautes" | "recommandations" | "actualites";

export interface TrendingMedia {
  type: MediaType;
  items: Media[];
  loading: boolean;
}

export interface UseDiscoverReturn {
  activeTab: DiscoverTab;
  trendingMedia: TrendingMedia[];
  newReleases: Media[];
  newReleasesLoading: boolean;
  recommendations: Media[];
  recommendationsLoading: boolean;
  news: any[];
  newsLoading: boolean;
  handleTabChange: (tab: DiscoverTab) => void;
  handleRefresh: () => Promise<void>;
}

export interface DiscoverPreferences {
  lastTab: DiscoverTab;
}
