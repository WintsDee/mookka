
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { NewsItem } from "@/services/news-service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="grid grid-cols-1 gap-5 px-2 pb-24">
        {items.map((item) => (
          <NewsCard 
            key={item.id} 
            item={item} 
            onSelect={() => onArticleSelect(item)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

interface NewsCardProps {
  item: NewsItem;
  onSelect: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onSelect }) => {
  const [imageError, setImageError] = React.useState(false);
  
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
      default: return '/placeholder.svg';
    }
  };

  // Décode les entités HTML comme l&#8217;
  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const title = decodeHtmlEntities(item.title);
  const description = item.description ? decodeHtmlEntities(item.description) : '';
  
  // Obtenir les couleurs de badge pour chaque catégorie
  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'film': return "bg-media-film/90 text-white";
      case 'serie': return "bg-media-serie/90 text-white";
      case 'book': return "bg-media-book/90 text-white";
      case 'game': return "bg-media-game/90 text-white";
      default: return "bg-slate-500/90 text-white";
    }
  };
  
  // Formater le nom de la catégorie pour l'affichage
  const getCategoryName = (category: string) => {
    switch(category) {
      case 'film': return 'Film';
      case 'serie': return 'Série';
      case 'book': return 'Livre';
      case 'game': return 'Jeu';
      default: return 'Actu';
    }
  };

  return (
    <Card 
      className="overflow-hidden border-border/20 bg-black/5 backdrop-blur-sm hover:shadow-lg hover:scale-[1.01] 
                active:scale-[0.99] transition-all duration-300 group"
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row h-full relative">
        <div className="w-full sm:w-2/5 h-48 sm:h-auto relative">
          <img 
            src={getImageUrl()}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent sm:hidden" />
          
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className={`${getCategoryBadge(item.category)} text-xs font-medium px-2 py-0.5`}>
              {getCategoryName(item.category)}
            </Badge>
            
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-border/30 text-xs">
              {item.source}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/10">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(new Date(item.date), { 
                  addSuffix: true,
                  locale: fr 
                })}
              </span>
            </div>
            
            <Button 
              size="sm" 
              variant="secondary"
              className="gap-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.link, '_blank');
              }}
            >
              <span>Lire</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
