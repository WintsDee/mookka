
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CollectionLoadingProps {
  isError?: boolean;
  onBack?: () => void;
}

export const CollectionLoading = ({ isError, onBack }: CollectionLoadingProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-destructive">Une erreur est survenue lors du chargement de la collection.</p>
        <Button onClick={handleBack} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="mt-4 text-lg">Chargement en cours...</p>
    </div>
  );
};
