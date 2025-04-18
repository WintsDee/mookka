
import { NewsItem } from "@/services/news-service";

export type NewsTab = "all" | "film" | "serie" | "book" | "game";

export interface NewsPreferences {
  lastTab: NewsTab;
  lastSource: string | null;
  lastSources: string[];
}

export interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  activeTab: NewsTab;
  activeSource: string | null;
  activeSources: string[];
  sources: string[];
  selectedArticle: NewsItem | null;
  handleTabChange: (tab: NewsTab) => void;
  handleSourceChange: (source: string | null) => void;
  handleSourcesChange: (sources: string[]) => void;
  handleRefresh: () => Promise<void>;
  handleArticleSelect: (article: NewsItem) => void;
  handleArticleClose: () => void;
}
