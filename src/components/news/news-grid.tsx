
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, ExternalLink, BookOpen, BookmarkPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { WebView } from "@/components/news/news-web-view";
import { toast } from "@/components/ui/sonner";
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
  // State for WebView
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [webViewOpen, setWebViewOpen] = useState(false);
  
  const openWebView = (article: NewsItem) => {
    setSelectedArticle(article);
    setWebViewOpen(true);
  };
  
  const closeWebView = () => {
    setWebViewOpen(false);
  };
  
  // Handle adding to library
  const addToLibrary = (article: NewsItem) => {
    toast.success("Ajouté à votre bibliothèque");
    // Fonctionnalité à implémenter plus tard
  };

  if (loading) {
    return (
      <div className="space-y-4 px-1">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden bg-secondary/40 border-border/50">
            <div className="relative h-44">
              <Skeleton className="h-44 w-full" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3 mt-1" />
              </div>
            </div>
          </Card>
        ))}
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
        className="absolute right-1 -top-12 z-10"
        onClick={onRefresh} 
        disabled={refreshing}
      >
        {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Rafraîchir
      </Button>
    
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 px-1 pb-20">
          {items.map((item) => (
            <NewsCard 
              key={item.id} 
              item={item} 
              onOpenWebView={openWebView}
              onAddToLibrary={addToLibrary}
            />
          ))}
        </div>
      </ScrollArea>
      
      {selectedArticle && (
        <WebView
          url={selectedArticle.link}
          title={selectedArticle.title}
          isOpen={webViewOpen}
          onClose={closeWebView}
        />
      )}
    </div>
  );
};

interface NewsCardProps {
  item: NewsItem;
  onOpenWebView: (article: NewsItem) => void;
  onAddToLibrary: (article: NewsItem) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  item, 
  onOpenWebView,
  onAddToLibrary
}) => {
  const [imageError, setImageError] = useState(false);
  const placeholderUrl = '/placeholder.svg';
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Vérifier si l'URL de l'image est valide
  const isValidImageUrl = (url: string) => {
    return url && url.startsWith('http');
  };
  
  const imageUrl = isValidImageUrl(item.image) && !imageError 
    ? item.image 
    : placeholderUrl;
    
  // Get badge color based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'film': return 'bg-media-film text-white hover:bg-media-film/80';
      case 'serie': return 'bg-media-serie text-white hover:bg-media-serie/80';
      case 'book': return 'bg-media-book text-white hover:bg-media-book/80';
      case 'game': return 'bg-media-game text-white hover:bg-media-game/80';
      default: return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };
  
  // Get formatted category name
  const getCategoryName = (category: string) => {
    switch(category) {
      case 'film': return 'Film';
      case 'serie': return 'Série';
      case 'book': return 'Livre';
      case 'game': return 'Jeu';
      default: return 'Général';
    }
  };

  return (
    <Card className="overflow-hidden bg-secondary/40 border-border/50 relative">
      <div className="relative">
        <div className="relative h-44">
          <img 
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-2 right-2">
            <Badge className={getCategoryColor(item.category)}>
              {getCategoryName(item.category)}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/80">
                {item.source} • {formatDistanceToNow(new Date(item.date), { 
                  addSuffix: true,
                  locale: fr
                })}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mt-1 line-clamp-2">{item.title}</h3>
          </div>
        </div>
        
        {item.description && (
          <div className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>
        )}
        
        <div className="flex justify-between p-3 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenWebView(item)}
          >
            <BookOpen size={16} className="mr-2" />
            Lire l'article
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddToLibrary(item)}
              title="Ajouter à ma bibliothèque"
            >
              <BookmarkPlus size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(item.link, '_blank')}
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
