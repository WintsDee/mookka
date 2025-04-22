
import { MediaType } from "@/types";
import { StatusOption } from "./types";

export const getStatusOptions = (type: MediaType): StatusOption[] => {
  switch (type) {
    case 'film':
      return [
        { 
          value: 'to-watch', 
          label: 'À voir', 
          description: 'Films que vous prévoyez de regarder',
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        },
        { 
          value: 'watching', 
          label: 'En cours', 
          description: 'Films que vous êtes en train de regarder',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        },
        { 
          value: 'completed', 
          label: 'Vu', 
          description: 'Films que vous avez terminés',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        }
      ];
    case 'serie':
      return [
        { 
          value: 'to-watch', 
          label: 'À voir', 
          description: 'Séries que vous prévoyez de regarder',
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        },
        { 
          value: 'watching', 
          label: 'En cours', 
          description: 'Séries que vous êtes en train de regarder',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        },
        { 
          value: 'completed', 
          label: 'Terminée', 
          description: 'Séries que vous avez terminées',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        }
      ];
    case 'book':
      return [
        { 
          value: 'to-read', 
          label: 'À lire', 
          description: 'Livres que vous prévoyez de lire',
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        },
        { 
          value: 'reading', 
          label: 'En cours', 
          description: 'Livres que vous êtes en train de lire',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        },
        { 
          value: 'completed', 
          label: 'Lu', 
          description: 'Livres que vous avez terminés',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        }
      ];
    case 'game':
      return [
        { 
          value: 'to-play', 
          label: 'À jouer', 
          description: 'Jeux auxquels vous prévoyez de jouer',
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        },
        { 
          value: 'playing', 
          label: 'En cours', 
          description: 'Jeux auxquels vous jouez actuellement',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        },
        { 
          value: 'completed', 
          label: 'Terminé', 
          description: 'Jeux que vous avez terminés',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        }
      ];
    default:
      return [
        { 
          value: 'to-watch', 
          label: 'À faire', 
          description: 'Médias à consommer plus tard',
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        },
        { 
          value: 'watching', 
          label: 'En cours', 
          description: 'Médias en cours',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        },
        { 
          value: 'completed', 
          label: 'Terminé', 
          description: 'Médias terminés',
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        }
      ];
  }
};
