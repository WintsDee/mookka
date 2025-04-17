
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate(-1)} 
      className="mb-6"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Retour
    </Button>
  );
};
