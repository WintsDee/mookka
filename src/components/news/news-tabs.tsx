
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsGrid } from "@/components/news/news-grid";
import { NewsItem } from "@/services/news-service";

interface NewsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

interface NewsTabsContentProps {
  news: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onArticleSelect: (article: NewsItem) => void;
}

const NewsTabs: React.FC<NewsTabsProps> & { Content: React.FC<NewsTabsContentProps> } = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
        <TabsTrigger value="film" className="text-xs">Films</TabsTrigger>
        <TabsTrigger value="serie" className="text-xs">Séries</TabsTrigger>
        <TabsTrigger value="book" className="text-xs">Livres</TabsTrigger>
        <TabsTrigger value="game" className="text-xs">Jeux</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// Composant de contenu séparé pour les onglets
const NewsTabsContent: React.FC<NewsTabsContentProps> = ({
  news,
  loading,
  refreshing,
  onRefresh,
  onArticleSelect
}) => {
  return (
    <div className="mt-4">
      <NewsGrid 
        items={news} 
        loading={loading} 
        refreshing={refreshing} 
        onRefresh={onRefresh}
        onArticleSelect={onArticleSelect}
      />
    </div>
  );
};

// Attacher le composant Content à NewsTabs
NewsTabs.Content = NewsTabsContent;

export { NewsTabs };
