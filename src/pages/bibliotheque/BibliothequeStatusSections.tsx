
import React from "react";
import { LibraryStatusSection } from "@/components/library/library-status-section";
import { Media } from "@/types";
import { Eye, Clock, Check } from "lucide-react";

interface BibliothequeStatusSectionsProps {
  filteredMedia: Media[];
}

export function BibliothequeStatusSections({ filteredMedia }: BibliothequeStatusSectionsProps) {
  const inProgressMedia = filteredMedia.filter(media => 
    ['watching', 'reading', 'playing'].includes(media.status || '')
  );
  const toDoMedia = filteredMedia.filter(media => 
    ['to-watch', 'to-read', 'to-play'].includes(media.status || '')
  );
  const completedMedia = filteredMedia.filter(media => media.status === 'completed');

  return (
    <>
      <LibraryStatusSection 
        title="En cours" 
        icon={Clock}
        media={inProgressMedia}
        emptyMessage="Vous n'avez aucun média en cours de consommation"
      />
      <LibraryStatusSection 
        title="À faire" 
        icon={Eye}
        media={toDoMedia}
        emptyMessage="Vous n'avez aucun média dans votre liste à faire"
      />
      <LibraryStatusSection 
        title="Terminé" 
        icon={Check}
        media={completedMedia}
        emptyMessage="Vous n'avez aucun média terminé"
      />
    </>
  );
}
