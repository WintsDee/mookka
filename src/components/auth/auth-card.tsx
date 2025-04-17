
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AuthForm } from "./auth-form";
import { AuthFooter } from "./auth-footer";

type AuthCardProps = {
  activeTab: "login" | "register";
  onGoogleSignIn: () => Promise<void>;
  googleLoading: boolean;
};

export const AuthCard = ({ activeTab, onGoogleSignIn, googleLoading }: AuthCardProps) => {
  return (
    <Card className="backdrop-blur-sm bg-background/95">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {activeTab === "login" ? "Connexion" : "Inscription"}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === "login" 
            ? "Connectez-vous pour accéder à votre bibliothèque" 
            : "Créez un compte pour commencer votre collection"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AuthForm 
          onGoogleSignIn={onGoogleSignIn}
          googleLoading={googleLoading} 
        />
      </CardContent>
      
      <AuthFooter />
    </Card>
  );
};
