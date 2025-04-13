
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { mockMedia } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ArrowLeft, Heart, Share, BookmarkPlus, Eye } from "lucide-react";
import { Media } from "@/types";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  // Trouver le média correspondant dans les données mockées
  const media = mockMedia.find(m => m.id === id);
  
  if (!media) {
    return (
      <Background>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </Background>
    );
  }
  
  // Fonction pour afficher les informations spécifiques selon le type de média
  const renderTypeSpecificInfo = (media: Media) => {
    switch (media.type) {
      case "film":
        return (
          <>
            {media.director && <p className="text-sm text-muted-foreground">Réalisateur: <span className="text-foreground">{media.director}</span></p>}
            {media.duration && <p className="text-sm text-muted-foreground mt-1">Durée: <span className="text-foreground">{media.duration}</span></p>}
          </>
        );
      case "serie":
        return (
          <>
            {media.duration && <p className="text-sm text-muted-foreground">Épisodes: <span className="text-foreground">{media.duration}</span></p>}
          </>
        );
      case "book":
        return (
          <>
            {media.author && <p className="text-sm text-muted-foreground">Auteur: <span className="text-foreground">{media.author}</span></p>}
          </>
        );
      case "game":
        return (
          <>
            {media.publisher && <p className="text-sm text-muted-foreground">Éditeur: <span className="text-foreground">{media.publisher}</span></p>}
            {media.platform && <p className="text-sm text-muted-foreground mt-1">Plateforme: <span className="text-foreground">{media.platform}</span></p>}
          </>
        );
      default:
        return null;
    }
  };
  
  // Détermine l'étiquette de statut
  const getStatusLabel = (status?: 'to-watch' | 'watching' | 'completed') => {
    switch (status) {
      case 'to-watch': return 'À découvrir';
      case 'watching': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'Non défini';
    }
  };

  return (
    <Background>
      <div className="relative pb-24">
        {/* Header avec image de couverture */}
        <div className="relative h-72 w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-10 bg-black/40 hover:bg-black/60"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="text-white" />
          </Button>
          
          <div className="absolute inset-0">
            <img 
              src={media.coverImage} 
              alt={media.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-start gap-4">
              <img 
                src={media.coverImage} 
                alt={media.title} 
                className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{media.title}</h1>
                <div className="flex items-center mt-1">
                  {media.year && <span className="text-sm text-white/80 mr-3">{media.year}</span>}
                  {media.rating && (
                    <div className="flex items-center mr-3">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="text-sm text-white/80">{media.rating}</span>
                    </div>
                  )}
                  {media.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-white/80 mr-1" />
                      <span className="text-sm text-white/80">{media.duration}</span>
                    </div>
                  )}
                </div>
                {media.genres && media.genres.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {media.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs py-0 border-white/20 text-white/90">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-around py-4 px-2 bg-secondary/40 backdrop-blur-sm border-y border-border">
          <Button variant="ghost" size="sm" className="flex flex-col items-center" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs mt-1">J'aime</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <BookmarkPlus className="h-5 w-5" />
            <span className="text-xs mt-1">Ajouter</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Eye className="h-5 w-5" />
            <span className="text-xs mt-1">{getStatusLabel(media.status)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Share className="h-5 w-5" />
            <span className="text-xs mt-1">Partager</span>
          </Button>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {media.description && (
            <div>
              <h2 className="text-lg font-medium mb-2">Synopsis</h2>
              <p className="text-sm text-muted-foreground">{media.description}</p>
            </div>
          )}
          
          {/* Informations spécifiques selon le type */}
          <div>
            <h2 className="text-lg font-medium mb-2">Informations</h2>
            <Card className="bg-secondary/40 border-border">
              <CardContent className="p-4">
                {renderTypeSpecificInfo(media)}
                {media.year && <p className="text-sm text-muted-foreground mt-1">Année: <span className="text-foreground">{media.year}</span></p>}
              </CardContent>
            </Card>
          </div>
          
          {/* Recommandations similaires */}
          <div>
            <h2 className="text-lg font-medium mb-2">Recommandations similaires</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              {mockMedia
                .filter(m => m.id !== media.id && m.type === media.type)
                .slice(0, 6)
                .map(similarMedia => (
                  <div 
                    key={similarMedia.id} 
                    className="min-w-[100px] w-[100px]"
                    onClick={() => navigate(`/media/${similarMedia.type}/${similarMedia.id}`)}
                  >
                    <img 
                      src={similarMedia.coverImage} 
                      alt={similarMedia.title} 
                      className="w-full h-36 object-cover rounded-md"
                    />
                    <h3 className="text-xs font-medium mt-1 line-clamp-2">{similarMedia.title}</h3>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default MediaDetail;
