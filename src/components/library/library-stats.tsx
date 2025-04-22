
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MediaType, MediaStatus, Media } from "@/types";
import { Book, Film, Tv, GamepadIcon, Clock, Check, Eye } from "lucide-react";
import { MediaTypeStatsGroup, MediaStatusCount } from "@/components/media-detail/dialog/types";
import { useNavigate } from 'react-router-dom';

interface LibraryStatsProps {
  userMedia: Media[];
}

export function LibraryStats({ userMedia }: LibraryStatsProps) {
  const navigate = useNavigate();

  // Fonction pour obtenir l'icône de type de média
  const getTypeIcon = (type: MediaType | 'all') => {
    switch (type) {
      case "film": return Film;
      case "serie": return Tv;
      case "book": return Book;
      case "game": return GamepadIcon;
      default: return Film; // Défaut pour 'all'
    }
  };

  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status: MediaStatus) => {
    if (status.startsWith('to-')) return Eye;
    if (status.includes('ing')) return Clock;
    return Check;
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: MediaStatus) => {
    switch (status) {
      case 'to-watch': return 'À voir';
      case 'to-read': return 'À lire';
      case 'to-play': return 'À jouer';
      case 'watching': return 'En cours';
      case 'reading': return 'En lecture';
      case 'playing': return 'En jeu';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  // Fonction pour regrouper les statuts
  const groupStatus = (status: MediaStatus): 'inProgress' | 'todo' | 'completed' => {
    if (status.includes('ing')) return 'inProgress';
    if (status.startsWith('to-')) return 'todo';
    return 'completed';
  };

  // Calcul des statistiques
  const calculateStats = (): MediaTypeStatsGroup[] => {
    const allMedia = userMedia || [];
    
    // Groupes de types de médias
    const typeGroups: MediaTypeStatsGroup[] = [
      { 
        type: 'all', 
        label: 'Tous', 
        icon: Film, 
        totalCount: 0,
        statusGroups: { inProgress: [], todo: [], completed: [] }
      },
      { 
        type: 'film', 
        label: 'Films', 
        icon: Film, 
        totalCount: 0,
        statusGroups: { inProgress: [], todo: [], completed: [] }
      },
      { 
        type: 'serie', 
        label: 'Séries', 
        icon: Tv, 
        totalCount: 0,
        statusGroups: { inProgress: [], todo: [], completed: [] }
      },
      { 
        type: 'book', 
        label: 'Livres', 
        icon: Book, 
        totalCount: 0,
        statusGroups: { inProgress: [], todo: [], completed: [] }
      },
      { 
        type: 'game', 
        label: 'Jeux', 
        icon: GamepadIcon, 
        totalCount: 0,
        statusGroups: { inProgress: [], todo: [], completed: [] }
      }
    ];

    // Compter les médias par type et statut
    allMedia.forEach(media => {
      if (!media.status) return;
      
      // Ajouter au groupe 'all'
      typeGroups[0].totalCount++;
      const allGroup = groupStatus(media.status as MediaStatus);
      const existingAllStatus = typeGroups[0].statusGroups[allGroup].find(
        s => s.status === media.status
      );
      
      if (existingAllStatus) {
        existingAllStatus.count++;
      } else {
        typeGroups[0].statusGroups[allGroup].push({
          status: media.status as MediaStatus,
          count: 1
        });
      }
      
      // Ajouter au groupe spécifique du type
      const typeIndex = typeGroups.findIndex(g => g.type === media.type);
      if (typeIndex > 0) {
        typeGroups[typeIndex].totalCount++;
        const statusGroup = groupStatus(media.status as MediaStatus);
        const existingStatus = typeGroups[typeIndex].statusGroups[statusGroup].find(
          s => s.status === media.status
        );
        
        if (existingStatus) {
          existingStatus.count++;
        } else {
          typeGroups[typeIndex].statusGroups[statusGroup].push({
            status: media.status as MediaStatus,
            count: 1
          });
        }
      }
    });
    
    return typeGroups;
  };

  const stats = calculateStats();

  const handleCardClick = (type: MediaType | 'all') => {
    navigate(`/bibliotheque/${type === 'all' ? '' : type}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((group) => (
        <Card 
          key={group.type} 
          className="hover:bg-accent/10 cursor-pointer transition-colors"
          onClick={() => handleCardClick(group.type)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <group.icon className="mr-2 h-5 w-5" />
              {group.label}
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {group.totalCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* En cours */}
            {group.statusGroups.inProgress.length > 0 && (
              <div className="flex items-center text-sm font-medium">
                <Clock className="mr-2 h-4 w-4 text-purple-500" />
                <span>En cours:</span>
                <span className="ml-auto text-muted-foreground">
                  {group.statusGroups.inProgress.reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
            )}
            
            {/* À faire */}
            {group.statusGroups.todo.length > 0 && (
              <div className="flex items-center text-sm font-medium">
                <Eye className="mr-2 h-4 w-4 text-amber-500" />
                <span>À faire:</span>
                <span className="ml-auto text-muted-foreground">
                  {group.statusGroups.todo.reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
            )}
            
            {/* Terminé */}
            {group.statusGroups.completed.length > 0 && (
              <div className="flex items-center text-sm font-medium">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Terminé:</span>
                <span className="ml-auto text-muted-foreground">
                  {group.statusGroups.completed.reduce((acc, curr) => acc + curr.count, 0)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
