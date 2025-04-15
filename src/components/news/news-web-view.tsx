
import React, { useState, useEffect } from "react";
import { X, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { supabase } from "@/integrations/supabase/client";

interface NewsWebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const NewsWebView: React.FC<NewsWebViewProps> = ({ url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [textOnly, setTextOnly] = useLocalStorage("news-text-only", false);
  const [articleContent, setArticleContent] = useState<string>("");
  const [isFirefox, setIsFirefox] = useState(false);
  
  useEffect(() => {
    // Detect Firefox browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsFirefox(userAgent.includes('firefox'));
    
    if (textOnly) {
      fetchTextContent(url);
    } else {
      setArticleContent("");
    }
  }, [url, textOnly]);
  
  const fetchTextContent = async (articleUrl: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news/extract-content', {
        body: { url: articleUrl }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.content) {
        setArticleContent(`
          <div class="article-content">
            <h1 class="text-xl font-bold mb-4">${title}</h1>
            <div class="article-text space-y-4">
              ${data.content.map((paragraph: string) => `<p>${paragraph}</p>`).join('')}
            </div>
          </div>
        `);
      } else {
        setArticleContent(`
          <div class="article-content">
            <h1 class="text-xl font-bold mb-4">${title}</h1>
            <div class="article-text space-y-4">
              <p>Le contenu de cet article n'a pas pu être extrait automatiquement.</p>
              <p>Essayez de consulter l'article original en désactivant le mode texte seulement.</p>
            </div>
          </div>
        `);
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction du contenu:", error);
      setArticleContent(`
        <div class="error-message">
          <h2 class="text-xl font-bold text-red-500 mb-4">Impossible d'extraire le contenu</h2>
          <p>Veuillez essayer de visualiser l'article complet en désactivant le mode texte.</p>
        </div>
      `);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a more compatible URL for Firefox
  const getCompatibleUrl = (originalUrl: string) => {
    // For Firefox, we'll try to use a proxy service or direct link when available
    if (isFirefox) {
      // First check if the URL is from a known service that blocks embedding
      if (originalUrl.includes('ecranlarge.com') || 
          originalUrl.includes('canardpc.com') ||
          originalUrl.includes('jeuxvideo.com')) {
        // Default to text mode for problematic sites
        if (!textOnly) {
          setTextOnly(true);
          return originalUrl;
        }
      }
    }
    return originalUrl;
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
            className="w-full h-full overflow-auto p-4 md:p-8 md:max-w-3xl md:mx-auto prose dark:prose-invert prose-headings:mb-2 prose-p:my-2"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        ) : (
          <iframe 
            src={getCompatibleUrl(url)}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            title={title}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
      
      {isFirefox && !textOnly && (
        <div className="bg-amber-500/10 p-2 text-center text-xs text-amber-800 dark:text-amber-300">
          <p>Firefox peut bloquer certains contenus. Si rien ne s'affiche, utilisez le mode texte.</p>
        </div>
      )}
    </div>
  );
};
