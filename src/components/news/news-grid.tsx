
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { NewsItem } from "@/services/news-service";
import { cn } from "@/lib/utils";

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
        <div className="space-y-5 px-2 pb-20">
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

  const getBorderGlow = (category: string) => {
    switch(category) {
      case 'film': return 'shadow-blue-500/20';
      case 'serie': return 'shadow-purple-500/20';
      case 'book': return 'shadow-emerald-500/20';
      case 'game': return 'shadow-amber-500/20';
      default: return 'shadow-slate-500/20';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden bg-card/50 backdrop-blur-sm border-border/30",
        "transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
        getBorderGlow(item.category)
      )}
      onClick={onSelect}
    >
      <div className="relative h-48 sm:h-52">
        <img 
          src={getImageUrl()}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10" />
        
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                {item.category === 'film' ? 'Film' : 
                 item.category === 'serie' ? 'Série' : 
                 item.category === 'book' ? 'Livre' : 
                 item.category === 'game' ? 'Jeu' : 'Actu'}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(item.date), { 
                  addSuffix: true,
                  locale: fr
                })}
              </span>
            </div>
            <span className="text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {item.source}
            </span>
          </div>
          
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{title}</h3>
          
          {item.description && (
            <p className="text-white/80 text-sm line-clamp-2 leading-snug drop-shadow-sm">
              {decodeHtmlEntities(item.description)}
            </p>
          )}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-1.5 w-fit bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white/90 border border-white/10"
          >
            <span className="flex items-center gap-1">
              Lire l'article <ExternalLink className="h-3 w-3" />
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
