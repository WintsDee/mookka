
import React, { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsTabProps {
  type: MediaType;
}

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  image: string;
  description?: string;
}

export function NewsTab({ type }: NewsTabProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('fetch-news', {
          body: { type }
        });
        
        if (error) {
          console.error("Erreur lors de la récupération des actualités:", error);
          return;
        }
        
        if (data && data.news) {
          setNews(data.news.slice(0, 10));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [type]);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-medium mb-4">Actualités</h2>
        <p className="text-muted-foreground">
          Aucune actualité trouvée pour ce type de média
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Actualités récentes</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {item.image && (
                <div className="w-full md:w-1/4 h-48 md:h-auto">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {item.source}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Lire <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
