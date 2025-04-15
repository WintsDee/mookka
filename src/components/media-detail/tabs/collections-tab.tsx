
import React, { useState, useEffect } from "react";
import { MediaCollectionsSection } from "@/components/media-collections-section";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface CollectionsTabProps {
  mediaId: string;
}

export function CollectionsTab({ mediaId }: CollectionsTabProps) {
  const { isAuthenticated } = useProfile();

  if (!mediaId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Impossible de gérer les collections pour ce média.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-medium mb-4">Gérer les collections</h2>
        <p className="text-muted-foreground mb-4">
          Connectez-vous pour ajouter ce média à vos collections
        </p>
        <Link to="/auth">
          <Button variant="default" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Gérer les collections</h2>
      <MediaCollectionsSection mediaId={mediaId} />
    </div>
  );
}
