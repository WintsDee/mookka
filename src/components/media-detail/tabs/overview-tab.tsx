
import React, { useState, useEffect } from "react";
import { MediaAdditionalInfo } from "@/components/media-additional-info";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface OverviewTabProps {
  description?: string;
  additionalInfo: any;
  mediaId: string;
  mediaType: MediaType;
}

export function OverviewTab({ description, additionalInfo, mediaId, mediaType }: OverviewTabProps) {
  const { isAuthenticated, profile } = useProfile();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRatings = async () => {
      if (!mediaId) return;
      
      try {
        const { data, error } = await supabase
          .from('media_ratings')
          .select('rating')
          .eq('media_id', mediaId);
          
        if (error) {
          console.error("Erreur lors de la récupération des notes:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const total = data.reduce((sum, item) => sum + item.rating, 0);
          setAverageRating(parseFloat((total / data.length).toFixed(1)));
          setRatingsCount(data.length);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error);
      }
    };
    
    fetchRatings();
  }, [mediaId]);

  return (
    <div className="space-y-6">
      {description && (
        <div>
          <h2 className="text-lg font-medium mb-2">Synopsis</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      {/* Affichage des notes moyennes */}
      <div>
        <h2 className="text-lg font-medium mb-2">Notes</h2>
        <div className="flex items-center gap-4 mb-2">
          {averageRating !== null ? (
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                averageRating >= 7 ? "bg-green-500/20 border-green-500/40 text-green-400" :
                averageRating >= 4 ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" :
                "bg-red-500/20 border-red-500/40 text-red-400"
              }`}>
                <span className="font-bold text-lg">{averageRating}</span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-muted-foreground">{ratingsCount} évaluation{ratingsCount > 1 ? 's' : ''}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune évaluation pour le moment</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Informations</h2>
        <MediaAdditionalInfo {...additionalInfo} />
      </div>
    </div>
  );
}
