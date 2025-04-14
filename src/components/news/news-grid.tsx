
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { NewsItem } from "@/services/news-service";

interface NewsGridProps {
  items: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ 
  items, 
  loading, 
  refreshing, 
  onRefresh 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Chargement des actualités...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-6">
        <p className="text-muted-foreground">
          Aucune actualité trouvée pour cette catégorie
        </p>
        <Button variant="outline" className="mt-4" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Rafraîchir
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 px-1">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
};

interface NewsCardProps {
  item: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden bg-secondary/40 border-border/50">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <div className="relative h-44">
          <img 
            src={item.image || '/placeholder.svg'} 
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <span className="text-xs text-white/80">
              {item.source} • {formatDistanceToNow(new Date(item.date), { 
                addSuffix: true,
                locale: fr
              })}
            </span>
            <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
          </div>
        </div>
      </a>
    </Card>
  );
};
