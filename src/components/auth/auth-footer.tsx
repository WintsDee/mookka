
import React from "react";
import { CardFooter } from "@/components/ui/card";

export const AuthFooter = () => {
  return (
    <CardFooter className="flex justify-center">
      <p className="text-xs text-muted-foreground text-center">
        En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>
    </CardFooter>
  );
};
