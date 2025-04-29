
import { MediaType, MediaStatus } from "@/types";
import { StatusOption } from "./types";

export function getStatusOptions(mediaType: MediaType): StatusOption[] {
  switch (mediaType) {
    case 'film':
    case 'serie':
      return [
        {
          value: 'to-watch',
          label: 'À voir',
          description: 'Ajouter ce média à votre liste de visionnage',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/50'
        },
        {
          value: 'watching',
          label: 'En cours',
          description: 'Vous êtes en train de regarder ce média',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-500/50'
        },
        {
          value: 'completed',
          label: 'Terminé',
          description: 'Vous avez terminé ce média',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/50'
        }
      ];
    case 'book':
      return [
        {
          value: 'to-read',
          label: 'À lire',
          description: 'Ajouter ce livre à votre liste de lecture',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/50'
        },
        {
          value: 'reading',
          label: 'En cours',
          description: 'Vous êtes en train de lire ce livre',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-500/50'
        },
        {
          value: 'completed',
          label: 'Terminé',
          description: 'Vous avez terminé ce livre',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/50'
        }
      ];
    case 'game':
      return [
        {
          value: 'to-play',
          label: 'À jouer',
          description: 'Ajouter ce jeu à votre liste de jeux',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/50'
        },
        {
          value: 'playing',
          label: 'En cours',
          description: 'Vous êtes en train de jouer à ce jeu',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-500/50'
        },
        {
          value: 'completed',
          label: 'Terminé',
          description: 'Vous avez terminé ce jeu',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/50'
        }
      ];
    default:
      return [
        {
          value: 'to-watch',
          label: 'À faire',
          description: 'Ajouter ce média à votre liste',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/50'
        },
        {
          value: 'watching',
          label: 'En cours',
          description: 'Vous êtes en train de consommer ce média',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-500/50'
        },
        {
          value: 'completed',
          label: 'Terminé',
          description: 'Vous avez terminé ce média',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/50'
        }
      ];
  }
}
