
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { MediaType } from "@/types";
import { cn, overlayGradient, enhanceTextVisibility, floatingElement } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-detail/media-rating-badge";

interface MediaDetailHeaderProps {
  media: any;
  formattedMedia: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailHeader({ media, formattedMedia, type, onAddToCollection }: MediaDetailHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("MediaDetailHeader props:", { 
    media: !!media, 
    formattedMedia: !!formattedMedia,
    type,
    coverImage: formattedMedia?.coverImage,
    title: formattedMedia?.title
  });
  
  const handleGoBack = () => {
    if (location.state?.from) {
      const previousPath = location.state.from;
      const searchParams = location.state.search || "";
      
      if (previousPath === "/recherche" && searchParams) {
        navigate({
          pathname: previousPath,
          search: searchParams
        }, { replace: true });
      } else {
        navigate(previousPath, { replace: true });
      }
    } else {
      navigate(-1);
    }
  };

  // Protection contre les données manquantes
  const coverImage = formattedMedia?.coverImage || '';
  const title = formattedMedia?.title || 'Titre non disponible';
  const year = formattedMedia?.year;
  const rating = formattedMedia?.rating;
  const userRating = formattedMedia?.userRating;
  const duration = formattedMedia?.duration;
  const genres = formattedMedia?.genres || [];

  // Navigation vers l'onglet critique améliorée
  const handleUserRatingClick = () => {
    console.log('Tentative de navigation vers l\'onglet critique');
    
    // Méthode 1: Utiliser le data attribute
    const critiqueTrigger = document.querySelector('[data-state="inactive"][value="critique"]') as HTMLElement;
    if (critiqueTrigger) {
      console.log('Navigation via data-state');
      critiqueTrigger.click();
      return;
    }

    // Méthode 2: Utiliser l'attribut value
    const critiqueTab = document.querySelector('[value="critique"]') as HTMLElement;
    if (critiqueTab) {
      console.log('Navigation via value attribute');
      critiqueTab.click();
      return;
    }

    // Méthode 3: Event personnalisé
    const customEvent = new CustomEvent('switchToCritique', { 
      detail: { targetTab: 'critique' },
      bubbles: true 
    });
    document.dispatchEvent(customEvent);
    console.log('Event personnalisé dispatché');

    // Fallback: Scroll vers l'onglet critique
    setTimeout(() => {
      const critiqueSection = document.getElementById('critique-tab');
      if (critiqueSection) {
        critiqueSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="relative h-52 w-full pt-8">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "absolute top-2 left-4 z-20 p-2",
          floatingElement('button', 'high')
        )}
        onClick={handleGoBack}
      >
        <X className="text-white w-6 h-6" />
      </Button>
      
      <div className="absolute top-2 right-4 z-20 flex gap-2 flex-col items-end">
        {rating && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-white font-medium drop-shadow-md">Note globale</span>
            <MediaRatingBadge 
              rating={rating} 
              size="large"
            />
          </div>
        )}
        
        {userRating && userRating > 0 && (
          <div 
            className="flex flex-col items-center gap-1 cursor-pointer transform transition-transform hover:scale-105" 
            onClick={handleUserRatingClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUserRatingClick();
              }
            }}
          >
            <span className="text-xs text-white font-medium drop-shadow-md">Ma note</span>
            <MediaRatingBadge 
              rating={userRating}
              size="large"
              className="bg-purple-500 hover:bg-purple-600 transition-colors shadow-lg ring-2 ring-white/20"
            />
          </div>
        )}
      </div>
      
      <div className="absolute inset-0">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
          }}
        />
        <div className={cn(overlayGradient('to-top', 'strong'), "bg-black/75")} />
      </div>
      
      <div className="absolute bottom-0 left-0 p-6 w-full flex items-end">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg mt-4"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="flex-1 ml-4 mt-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className={cn("text-2xl font-bold text-white drop-shadow-md truncate max-w-full", enhanceTextVisibility('strong'))}>
              {title}
            </h1>
            <Badge variant={type} className="capitalize shadow-md shrink-0">
              {type}
            </Badge>
          </div>
          <div className="flex items-center mt-1 text-white mb-2 font-medium drop-shadow-md">
            {year && <span className="text-sm mr-3">{year}</span>}
            {duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-white mr-1" />
                <span className="text-sm">{duration}</span>
              </div>
            )}
          </div>
          {genres && genres.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {genres.map((genre: string) => (
                <Badge 
                  key={genre} 
                  variant="outline" 
                  className={cn(
                    "text-xs py-0 bg-black/60 backdrop-blur-sm border-white/30 text-white font-medium shadow-md",
                    floatingElement('badge', 'medium')
                  )}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
