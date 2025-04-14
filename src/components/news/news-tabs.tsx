
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsGrid } from "@/components/news/news-grid";
import { NewsItem } from "@/services/news-service";

interface NewsTabsProps {
  news: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
}

export const NewsTabs: React.FC<NewsTabsProps> = ({
  news,
  loading,
  refreshing,
  activeTab,
  onTabChange,
  onRefresh
}) => {
  return (
    <Tabs defaultValue={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
        <TabsTrigger value="film" className="text-xs">Films</TabsTrigger>
        <TabsTrigger value="serie" className="text-xs">Séries</TabsTrigger>
        <TabsTrigger value="book" className="text-xs">Livres</TabsTrigger>
        <TabsTrigger value="game" className="text-xs">Jeux</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <NewsGrid items={news} loading={loading} refreshing={refreshing} onRefresh={onRefresh} />
      </TabsContent>
      
      <TabsContent value="film" className="mt-4">
        <NewsGrid 
          items={news.filter(item => item.category === 'film')} 
          loading={loading} 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      </TabsContent>
      
      <TabsContent value="serie" className="mt-4">
        <NewsGrid 
          items={news.filter(item => item.category === 'serie')} 
          loading={loading} 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      </TabsContent>
      
      <TabsContent value="book" className="mt-4">
        <NewsGrid 
          items={news.filter(item => item.category === 'book')} 
          loading={loading} 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      </TabsContent>
      
      <TabsContent value="game" className="mt-4">
        <NewsGrid 
          items={news.filter(item => item.category === 'game')} 
          loading={loading} 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      </TabsContent>
    </Tabs>
  );
};
