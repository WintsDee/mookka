
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { NewsItem } from "@/services/news-service";

interface NewsGridProps {
  items: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onArticleSelect: (article: NewsItem) => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ 
  items, 
  loading, 
  refreshing, 
  onRefresh,
  onArticleSelect
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
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <p className="text-muted-foreground">
          Aucune actualité trouvée pour cette catégorie
        </p>
        <Button variant="outline" className="mt-4" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Rafraîchir
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-0 right-2 z-10"
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </Button>
      
      <ScrollArea className="h-[calc(100vh-230px)]">
        <div className="space-y-4 px-1 pb-20">
          {items.map((item) => (
            <NewsCard 
              key={item.id} 
              item={item} 
              onSelect={() => onArticleSelect(item)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface NewsCardProps {
  item: NewsItem;
  onSelect: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onSelect }) => {
  const [imageError, setImageError] = React.useState(false);
  const placeholderUrl = '/placeholder.svg';
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Vérifier si l'URL de l'image est valide
  const isValidImageUrl = (url: string) => {
    return url && url.startsWith('http');
  };
  
  // Si l'image n'est pas valide ou vide, utiliser une image par défaut en fonction de la catégorie
  const getImageUrl = () => {
    if (isValidImageUrl(item.image) && !imageError) {
      return item.image;
    }
    
    // Images par défaut selon la catégorie
    switch(item.category) {
      case 'film': return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format';
      case 'serie': return 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=500&auto=format';
      case 'book': return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500&auto=format';
      case 'game': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format';
      default: return placeholderUrl;
    }
  };

  // Décode les entités HTML comme l&#8217;
  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const title = decodeHtmlEntities(item.title);
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'film': return 'bg-media-film';
      case 'serie': return 'bg-media-serie';
      case 'book': return 'bg-media-book';
      case 'game': return 'bg-media-game';
      default: return 'bg-slate-500';
    }
  };

  return (
    <Card 
      className="overflow-hidden bg-secondary/40 border-border/50 transition-transform hover:scale-[1.01] active:scale-[0.99]"
      onClick={onSelect}
    >
      <div className="relative h-44">
        <img 
          src={getImageUrl()}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs text-white px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
              {item.category === 'film' ? 'Film' : 
               item.category === 'serie' ? 'Série' : 
               item.category === 'book' ? 'Livre' : 
               item.category === 'game' ? 'Jeu' : 'Actu'}
            </span>
            <span className="text-xs text-white/80">
              {item.source} • {formatDistanceToNow(new Date(item.date), { 
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>
          
          <h3 className="text-white font-bold text-lg line-clamp-2">{title}</h3>
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-white/90 mt-1.5 bg-white/20 hover:bg-white/30"
          >
            Lire l'article
          </Button>
        </div>
      </div>
    </Card>
  );
};
