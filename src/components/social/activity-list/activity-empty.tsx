
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const ActivityEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center px-6">
      <p className="text-muted-foreground mb-4">
        Aucune activité pour le moment. Ajoutez des médias à votre bibliothèque pour les voir apparaître ici.
      </p>
      <Button asChild>
        <Link to="/recherche">Découvrir des médias</Link>
      </Button>
    </div>
  );
};
