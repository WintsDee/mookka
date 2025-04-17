
import React, { useState, useEffect } from "react";
import { X, Type, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface NewsWebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const NewsWebView: React.FC<NewsWebViewProps> = ({ url, title, onClose }) => {
  // Par défaut, on n'est pas en mode texte (false)
  const [textOnly, setTextOnly] = useLocalStorage("news-text-only", false);
  const [loading, setLoading] = useState(true);
  const [articleContent, setArticleContent] = useState<string>("");
  const [isFirefox, setIsFirefox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [extractionError, setExtractionError] = useState(false);
  const [contentFetched, setContentFetched] = useState(false);
  
  useEffect(() => {
    // Detect browser and device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsFirefox(userAgent.includes('firefox'));
    setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
  }, []);
  
  useEffect(() => {
    // Si on passe en mode texte et qu'on n'a pas encore récupéré le contenu
    if (textOnly && !contentFetched) {
      fetchTextContent(url);
    }
  }, [textOnly, url, contentFetched]);
  
  const handleToggleTextMode = (checked: boolean) => {
    setTextOnly(checked);
    
    // Si on active le mode texte et qu'on n'a pas encore récupéré le contenu
    if (checked && !contentFetched) {
      fetchTextContent(url);
    }
  };
  
  const fetchTextContent = async (articleUrl: string) => {
    setIsContentLoading(true);
    setExtractionError(false);
    
    try {
      console.log("Fetching text content for:", articleUrl);
      const { data, error } = await supabase.functions.invoke('fetch-news/extract-content', {
        body: { url: articleUrl }
      });
      
      if (error) {
        console.error("Error invoking extract-content function:", error);
        throw new Error(error.message);
      }
      
      if (data && data.content && data.content.length > 0) {
        setArticleContent(`
          <div class="article-content">
            <h1 class="text-xl font-bold mb-4">${title}</h1>
            <div class="article-text space-y-4">
              ${data.content.map((paragraph: string) => `<p>${paragraph}</p>`).join('')}
            </div>
          </div>
        `);
        setExtractionError(false);
      } else {
        console.log("No content extracted or empty content returned");
        setArticleContent(`
          <div class="article-content">
            <h1 class="text-xl font-bold mb-4">${title}</h1>
            <div class="article-text space-y-4">
              <p>Le contenu de cet article n'a pas pu être extrait automatiquement.</p>
              <p>Essayez de consulter l'article original en cliquant sur le bouton ci-dessous.</p>
            </div>
          </div>
        `);
        setExtractionError(true);
      }
      
      // Marquer que le contenu a été récupéré
      setContentFetched(true);
    } catch (error) {
      console.error("Error extracting article content:", error);
      setArticleContent(`
        <div class="error-message">
          <h2 class="text-xl font-bold text-red-500 mb-4">Impossible d'extraire le contenu</h2>
          <p>Veuillez essayer de visualiser l'article complet en ouvrant le lien externe.</p>
        </div>
      `);
      setExtractionError(true);
      toast.error("Erreur lors de l'extraction du contenu");
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleOpenOriginal = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="mx-2 overflow-hidden flex-1">
          <h2 className="text-md font-medium whitespace-nowrap overflow-hidden text-ellipsis">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Switch 
              checked={textOnly} 
              onCheckedChange={handleToggleTextMode} 
              id="text-only" 
              aria-label="Mode texte seulement"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenOriginal}
            title="Ouvrir l'article original"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {loading && !textOnly && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {isContentLoading && textOnly && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {textOnly ? (
          <div 
            className="w-full h-full overflow-auto p-4 md:p-8 md:max-w-3xl md:mx-auto prose dark:prose-invert prose-headings:mb-2 prose-p:my-2"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        ) : (
          <div className="w-full h-full overflow-hidden">
            <iframe 
              src={url}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={title}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}
        
        {(extractionError && textOnly) || (isMobile && !textOnly) ? (
          <div className="flex justify-center mt-4 mb-6 px-4">
            <Button 
              variant="outline" 
              onClick={handleOpenOriginal} 
              className="gap-2"
            >
              Ouvrir l'article dans le navigateur <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null}
      </div>
      
      {(isFirefox || isMobile) && !textOnly && (
        <div className="bg-amber-500/10 p-2 text-center text-xs text-amber-800 dark:text-amber-300">
          <p>Le contenu peut ne pas s'afficher correctement. Passez en mode texte ou ouvrez l'article dans votre navigateur.</p>
        </div>
      )}
    </div>
  );
};
