
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ArrowLeft, Heart, Share, BookmarkPlus, Eye, Loader2 } from "lucide-react";
import { getMediaById, addMediaToLibrary } from "@/services/media-service";
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          const mediaData = await getMediaById(type as MediaType, id);
          setMedia(mediaData);
        } catch (error) {
          console.error("Erreur lors de la récupération du média:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails du média",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMediaDetails();
  }, [type, id, toast]);

  const handleAddToLibrary = async () => {
    if (!media || !type) return;

    setIsAddingToLibrary(true);
    try {
      await addMediaToLibrary(media, type as MediaType);
      toast({
        title: "Succès",
        description: `${type === 'film' ? 'Le film' : type === 'serie' ? 'La série' : type === 'book' ? 'Le livre' : 'Le jeu'} a été ajouté à votre bibliothèque`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  if (isLoading) {
    return (
      <Background>
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </Background>
    );
  }

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

  // Formater les données selon le type de média
  let formattedMedia: any = {};
  
  switch (type) {
    case 'film':
      formattedMedia = {
        id: media.id.toString(),
        title: media.title,
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.release_date ? media.release_date.substring(0, 4) : null,
        rating: media.vote_average || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview,
        duration: media.runtime ? `${media.runtime} min` : null,
        director: media.credits?.crew?.find((p: any) => p.job === 'Director')?.name,
        type: 'film'
      };
      break;
    case 'serie':
      formattedMedia = {
        id: media.id.toString(),
        title: media.name,
        coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
        year: media.first_air_date ? media.first_air_date.substring(0, 4) : null,
        rating: media.vote_average || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.overview,
        duration: media.number_of_seasons ? `${media.number_of_seasons} saison${media.number_of_seasons > 1 ? 's' : ''}` : null,
        type: 'serie'
      };
      break;
    case 'book':
      formattedMedia = {
        id: media.id,
        title: media.volumeInfo?.title,
        coverImage: media.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
        year: media.volumeInfo?.publishedDate ? media.volumeInfo.publishedDate.substring(0, 4) : null,
        genres: media.volumeInfo?.categories || [],
        description: media.volumeInfo?.description,
        author: media.volumeInfo?.authors?.join(', '),
        type: 'book'
      };
      break;
    case 'game':
      formattedMedia = {
        id: media.id.toString(),
        title: media.name,
        coverImage: media.background_image || '/placeholder.svg',
        year: media.released ? media.released.substring(0, 4) : null,
        rating: media.rating || null,
        genres: media.genres?.map((g: any) => g.name) || [],
        description: media.description_raw,
        publisher: media.publishers?.length > 0 ? media.publishers[0].name : null,
        platform: media.platforms?.map((p: any) => p.platform.name).join(', '),
        type: 'game'
      };
      break;
  }

  // Fonction pour afficher les informations spécifiques selon le type de média
  const renderTypeSpecificInfo = () => {
    switch (type) {
      case "film":
        return (
          <>
            {formattedMedia.director && <p className="text-sm text-muted-foreground">Réalisateur: <span className="text-foreground">{formattedMedia.director}</span></p>}
            {formattedMedia.duration && <p className="text-sm text-muted-foreground mt-1">Durée: <span className="text-foreground">{formattedMedia.duration}</span></p>}
          </>
        );
      case "serie":
        return (
          <>
            {formattedMedia.duration && <p className="text-sm text-muted-foreground">Épisodes: <span className="text-foreground">{formattedMedia.duration}</span></p>}
          </>
        );
      case "book":
        return (
          <>
            {formattedMedia.author && <p className="text-sm text-muted-foreground">Auteur: <span className="text-foreground">{formattedMedia.author}</span></p>}
          </>
        );
      case "game":
        return (
          <>
            {formattedMedia.publisher && <p className="text-sm text-muted-foreground">Éditeur: <span className="text-foreground">{formattedMedia.publisher}</span></p>}
            {formattedMedia.platform && <p className="text-sm text-muted-foreground mt-1">Plateforme: <span className="text-foreground">{formattedMedia.platform}</span></p>}
          </>
        );
      default:
        return null;
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
              src={formattedMedia.coverImage} 
              alt={formattedMedia.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-start gap-4">
              <img 
                src={formattedMedia.coverImage} 
                alt={formattedMedia.title} 
                className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{formattedMedia.title}</h1>
                <div className="flex items-center mt-1">
                  {formattedMedia.year && <span className="text-sm text-white/80 mr-3">{formattedMedia.year}</span>}
                  {formattedMedia.rating && (
                    <div className="flex items-center mr-3">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="text-sm text-white/80">{formattedMedia.rating}</span>
                    </div>
                  )}
                  {formattedMedia.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-white/80 mr-1" />
                      <span className="text-sm text-white/80">{formattedMedia.duration}</span>
                    </div>
                  )}
                </div>
                {formattedMedia.genres && formattedMedia.genres.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {formattedMedia.genres.map((genre: string) => (
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center"
            onClick={handleAddToLibrary}
            disabled={isAddingToLibrary}
          >
            {isAddingToLibrary ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
            <span className="text-xs mt-1">Ajouter</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Eye className="h-5 w-5" />
            <span className="text-xs mt-1">À voir</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Share className="h-5 w-5" />
            <span className="text-xs mt-1">Partager</span>
          </Button>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {formattedMedia.description && (
            <div>
              <h2 className="text-lg font-medium mb-2">Synopsis</h2>
              <p className="text-sm text-muted-foreground">{formattedMedia.description}</p>
            </div>
          )}
          
          {/* Informations spécifiques selon le type */}
          <div>
            <h2 className="text-lg font-medium mb-2">Informations</h2>
            <Card className="bg-secondary/40 border-border">
              <CardContent className="p-4">
                {renderTypeSpecificInfo()}
                {formattedMedia.year && <p className="text-sm text-muted-foreground mt-1">Année: <span className="text-foreground">{formattedMedia.year}</span></p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default MediaDetail;
