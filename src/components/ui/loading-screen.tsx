
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#0F1524] flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/lovable-uploads/b0bb1f66-b362-4d55-8a5e-5dede4e852e7.png"
          alt="Mookka"
          className="w-16 h-16 animate-pulse"
        />
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    </div>
  );
};
