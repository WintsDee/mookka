
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { PageTitle } from "@/components/page-title";
import { useNews } from "@/hooks/use-news";
import { NewsTabs } from "@/components/news/news-tabs";

const Actualites = () => {
  const { news, loading, refreshing, activeTab, handleTabChange, handleRefresh } = useNews();
  
  return (
    <Background>
      <div className="pb-24 pt-6">
        <header className="px-6 mb-6">
          <PageTitle title="Actualités" />
          <div className="flex justify-between items-center mt-4">
            <NewsTabs 
              news={news}
              loading={loading}
              refreshing={refreshing}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onRefresh={handleRefresh}
            />
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Actualites;
