
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare } from "lucide-react";
import { HelpFeedback } from "@/components/profile/help-feedback/index";

export function SupportSection() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Button 
        onClick={() => navigate("/soutenir")}
        className="w-full gap-2 text-base font-medium py-6 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all shadow-lg shadow-primary/20"
        size="lg"
      >
        <Heart className="w-5 h-5" />
        Soutenir le projet
      </Button>
      
      <HelpFeedback
        buttonText="Donner mon feedback"
        buttonIcon={true}
        buttonVariant="outline"
        className="w-full"
        initialTab="feedback"
      >
        <Button variant="outline" size="lg" className="w-full gap-2 text-base py-6">
          <MessageSquare className="w-5 h-5" />
          Donner mon feedback
        </Button>
      </HelpFeedback>
    </div>
  );
}
