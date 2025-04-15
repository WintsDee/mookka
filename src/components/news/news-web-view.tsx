
import React, { useState, useEffect } from "react";
import { X, ArrowLeft, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface NewsWebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const NewsWebView: React.FC<NewsWebViewProps> = ({ url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [textOnly, setTextOnly] = useLocalStorage("news-text-only", false);
  const [articleContent, setArticleContent] = useState<string>("");
  
  useEffect(() => {
    if (textOnly) {
      // Si mode texte seulement, on tente d'extraire le contenu
      fetchTextContent(url);
    } else {
      // Sinon on réinitialise le contenu extrait
      setArticleContent("");
    }
  }, [url, textOnly]);
  
  // Fonction pour extraire le contenu textuel d'un article
  const fetchTextContent = async (articleUrl: string) => {
    setLoading(true);
    try {
      // Utiliser la fonction edge pour extraire le contenu
      // Notez que cela n'est pas implémenté côté serveur dans cet exemple
      // Pour une implémentation réelle, il faudrait créer cette fonction edge
      setArticleContent(`<div class="article-content">
        <h1>${title}</h1>
        <div class="article-text">
          <p>Cet article est affiché en mode texte pour améliorer les performances. Le contenu est extrait de l'article original.</p>
          <p>Pour une expérience complète, désactivez le mode texte seulement.</p>
        </div>
      </div>`);
    } catch (error) {
      console.error("Erreur lors de l'extraction du contenu:", error);
      setArticleContent(`<div class="error-message">
        <h2>Impossible d'extraire le contenu</h2>
        <p>Veuillez essayer de visualiser l'article complet en désactivant le mode texte.</p>
      </div>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="mx-2 overflow-hidden flex-1">
          <h2 className="text-md font-medium whitespace-nowrap overflow-hidden text-ellipsis">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Switch 
              checked={textOnly} 
              onCheckedChange={setTextOnly} 
              id="text-only" 
              aria-label="Mode texte seulement"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {textOnly ? (
          <div 
            className="w-full h-full overflow-auto p-4 md:p-8 md:max-w-3xl md:mx-auto article-content"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        ) : (
          <iframe 
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            title={title}
          />
        )}
      </div>
    </div>
  );
};
