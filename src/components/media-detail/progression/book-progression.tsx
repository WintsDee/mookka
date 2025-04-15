
import React, { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Check, Clock, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BookProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function BookProgression({ mediaDetails, progression, onUpdate }: BookProgressionProps) {
  const [currentPage, setCurrentPage] = useState(progression?.current_page || 0);
  const [totalPages, setTotalPages] = useState(
    progression?.total_pages || mediaDetails?.pages || 0
  );
  const [status, setStatus] = useState(progression?.status || 'to-read');
  
  // Reference to track if component is in initial mount phase
  const initialMount = useRef(true);

  useEffect(() => {
    // Mettre à jour quand la progression externe change
    if (progression) {
      setCurrentPage(progression.current_page || 0);
      setTotalPages(progression.total_pages || mediaDetails?.pages || 0);
      setStatus(progression.status || 'to-read');
    }
  }, [progression, mediaDetails]);

  // Only update when component is mounted to prevent unnecessary API calls
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
  }, []);

  const updateCurrentPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value) || 0;
    const validPage = Math.min(Math.max(0, newPage), totalPages);
    setCurrentPage(validPage);
  };

  const saveCurrentPage = (e: React.FocusEvent<HTMLInputElement>) => {
    const validPage = Math.min(Math.max(0, currentPage), totalPages);
    
    let newStatus = status;
    if (validPage === 0) {
      newStatus = 'to-read';
    } else if (validPage === totalPages) {
      newStatus = 'completed';
    } else if (validPage > 0) {
      newStatus = 'reading';
    }
    
    setStatus(newStatus);
    setCurrentPage(validPage);
    
    onUpdate({
      ...progression,
      current_page: validPage,
      total_pages: totalPages,
      status: newStatus
    });
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    
    let newCurrentPage = currentPage;
    
    if (newStatus === 'completed') {
      newCurrentPage = totalPages;
    } else if (newStatus === 'to-read') {
      newCurrentPage = 0;
    } else if (newStatus === 'reading' && currentPage === 0) {
      newCurrentPage = 1;
    }
    
    setCurrentPage(newCurrentPage);
    
    onUpdate({
      ...progression,
      current_page: newCurrentPage,
      total_pages: totalPages,
      status: newStatus
    });
  };

  // Formater le statut pour l'affichage
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-read': return 'À lire';
      case 'reading': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'À lire';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'to-read': return 'text-yellow-500';
      case 'reading': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Progression</h2>
          <Badge 
            className={`${getStatusColor(status)} bg-background/50 backdrop-blur-sm border-current px-3 py-1`}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
        
        <div className="flex gap-4 mb-4">
          <Button
            size="sm"
            variant={status === 'to-read' ? 'default' : 'outline'}
            className={status === 'to-read' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            onClick={() => updateStatus('to-read')}
            type="button"
          >
            <Eye className="h-4 w-4 mr-1" />
            À lire
          </Button>
          <Button
            size="sm"
            variant={status === 'reading' ? 'default' : 'outline'}
            className={status === 'reading' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => updateStatus('reading')}
            type="button"
          >
            <Clock className="h-4 w-4 mr-1" />
            En cours
          </Button>
          <Button
            size="sm"
            variant={status === 'completed' ? 'default' : 'outline'}
            className={status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
            onClick={() => updateStatus('completed')}
            type="button"
          >
            <Check className="h-4 w-4 mr-1" />
            Terminé
          </Button>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">Progression de lecture</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="current-page" className="block text-sm text-muted-foreground mb-1">
              Page actuelle
            </label>
            <Input
              id="current-page"
              type="number"
              min={0}
              max={totalPages}
              value={currentPage}
              onChange={updateCurrentPage}
              onBlur={saveCurrentPage}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="total-pages" className="block text-sm text-muted-foreground mb-1">
              Nombre total de pages
            </label>
            <Input
              id="total-pages"
              type="number"
              min={1}
              value={totalPages}
              readOnly
              className="w-full bg-muted/50 cursor-not-allowed"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Progression de lecture</span>
            <span className="text-sm font-medium">
              {totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0}%
            </span>
          </div>
          
          <Progress 
            value={totalPages > 0 ? (currentPage / totalPages) * 100 : 0} 
            className="h-2 bg-secondary/30"
          />
          
          <p className="mt-2 text-sm text-muted-foreground">
            {currentPage} sur {totalPages} pages lues
          </p>
        </div>
      </div>
    </div>
  );
}
