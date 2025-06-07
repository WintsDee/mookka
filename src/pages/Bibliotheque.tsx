
import React, { useState, useEffect, useMemo } from "react";
import { Background } from "@/components/ui/background";
import { MediaCard } from "@/components/media-card";
import { LibraryTypeSelector } from "@/components/library/library-type-selector";
import { LibrarySearch } from "@/components/library/library-search";
import { getUserLibrary } from "@/services/media";
import { Media, MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Bibliotheque = () => {
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [library, setLibrary] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserLibrary();
        setLibrary(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement de la bibliothèque:", error);
        setError("Impossible de charger votre bibliothèque");
        toast({
          title: "Erreur",
          description: "Impossible de charger votre bibliothèque",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [toast]);

  const filteredLibrary = useMemo(() => {
    return library.filter((item) => {
      // Filter by type
      const typeMatch = selectedType === "all" || item.type === selectedType;
      
      // Filter by search query
      const searchMatch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return typeMatch && searchMatch;
    });
  }, [library, selectedType, searchQuery]);

  const formattedMedia = useMemo(() => {
    return filteredLibrary.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type as MediaType,
      coverImage: item.cover_image,
      year: item.year,
      rating: item.rating,
      status: item.status,
      duration: item.duration,
      userRating: item.user_rating,
    }));
  }, [filteredLibrary]);

  if (error) {
    return (
      <Background>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Ma Bibliothèque</h1>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LibraryTypeSelector 
              selectedType={selectedType} 
              onSelectType={setSelectedType} 
            />
            <LibrarySearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery} 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="w-full h-60" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : formattedMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedType !== "all" 
                ? "Aucun média trouvé avec ces critères"
                : "Votre bibliothèque est vide"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {formattedMedia.map((media) => (
              <MediaCard 
                key={media.id} 
                media={media} 
                from="/bibliotheque"
                userRating={media.userRating}
              />
            ))}
          </div>
        )}
      </div>
    </Background>
  );
};

export default Bibliotheque;
