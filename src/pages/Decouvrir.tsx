import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useNews } from "@/hooks/use-news";
import { NewsGrid } from "@/components/news/news-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { NewsWebView } from "@/components/news/news-web-view";

const Decouvrir = () => {
  const [activeTab, setActiveTab] = useLocalStorage("decouvrir-tab", "actualites");
  const { 
    news, 
    loading, 
    refreshing,
    handleRefresh,
    handleArticleSelect,
    selectedArticle,
    handleArticleClose
  } = useNews();
  
  return (
    <Background className="animate-fade-in">
      <MobileHeader title="Découvrir" />
      <div className="pb-24 pt-safe mt-16">
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 h-11 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TabsTrigger value="actualites">Actualités</TabsTrigger>
              <TabsTrigger value="tendances">Tendances</TabsTrigger>
            </TabsList>
            
            <TabsContent value="actualites" className="mt-2">
              <NewsGrid 
                items={news}
                loading={loading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onArticleSelect={handleArticleSelect}
              />
            </TabsContent>
            
            <TabsContent value="tendances" className="mt-2">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4 px-2">
                  {/* Placeholder for now - will be implemented in next iteration */}
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <p className="text-muted-foreground">
                      Les tendances seront disponibles dans une prochaine mise à jour
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedArticle && (
        <NewsWebView
          url={selectedArticle.link}
          title={selectedArticle.title}
          onClose={handleArticleClose}
        />
      )}
      
      <MobileNav />
    </Background>
  );
};

export default Decouvrir;
