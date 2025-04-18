
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#0F1524] flex items-center justify-center z-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
