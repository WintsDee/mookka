
import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { MediaType, Media } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LibraryStats } from "@/components/library/library-stats";
import { BibliothequeHeader } from "./BibliothequeHeader";
import { BibliothequeStatusSections } from "./BibliothequeStatusSections";

const BibliothequeContainer = () => {
  const { type } = useParams<{ type?: string }>();
  
  const [mediaType, setMediaType] = useState<MediaType | "all">(
    (type as MediaType) || "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "rating">("date");
  const navigate = useNavigate();
  
  const { data: userMedia = [], isLoading } = useQuery({
    queryKey: ['userMediaLibrary'],
    queryFn: () => import("@/services/media/operations").then(m => m.getUserMediaLibrary())
  });

  useEffect(() => {
    if (mediaType === "all") {
      navigate("/bibliotheque", { replace: true });
    } else {
      navigate(`/bibliotheque/${mediaType}`, { replace: true });
    }
  }, [mediaType, navigate]);

  const filteredMedia = userMedia
    .filter(media => mediaType === "all" || media.type === mediaType)
    .filter(media => 
      searchTerm === "" || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (media.genres && media.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      const mediaA = a as Media & { added_at?: string; user_rating?: number };
      const mediaB = b as Media & { added_at?: string; user_rating?: number };
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return ((mediaB.user_rating || 0) - (mediaA.user_rating || 0));
        case "date":
        default:
          if (mediaA.added_at && mediaB.added_at) {
            return new Date(mediaB.added_at).getTime() - new Date(mediaA.added_at).getTime();
          }
          return (b.year || 0) - (a.year || 0);
      }
    });

  // Search triggers "recherche" page if no match
  const handleSearch = () => {
    if (searchTerm && filteredMedia.length === 0) {
      navigate(`/recherche?q=${encodeURIComponent(searchTerm)}&type=${mediaType === "all" ? "" : mediaType}`);
    }
  };

  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 h-full overflow-hidden">
        <BibliothequeHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          mediaType={mediaType}
          setMediaType={setMediaType}
        />
        <div className="mt-36 px-6 pb-16">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : (
            <>
              <LibraryStats userMedia={userMedia} />
              <BibliothequeStatusSections filteredMedia={filteredMedia} />
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default BibliothequeContainer;
