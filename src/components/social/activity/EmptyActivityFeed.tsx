
import React from "react";
import { Loader2, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyActivityFeedProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function EmptyActivityFeed({ onRefresh, refreshing }: EmptyActivityFeedProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center px-6 mt-8">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Aucune activité pour le moment</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ajoutez des amis pour voir leurs activités récentes. Vous pourrez voir ce qu'ils regardent, 
        lisent ou jouent, et interagir avec leurs publications.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/social?tab=friends">
          <Button variant="default" className="gap-2">
            <Users className="h-4 w-4" />
            <span>Trouver des amis</span>
          </Button>
        </Link>
        
        <Link to="/recherche">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Découvrir des médias</span>
          </Button>
        </Link>
        
        <Button variant="ghost" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Actualiser
        </Button>
      </div>
    </div>
  );
}
