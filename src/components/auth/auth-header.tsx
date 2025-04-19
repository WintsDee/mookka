
import { APP_INFO } from "@/config/app-info";

export function AuthHeader() {
  return (
    <div className="text-center">
      <img 
        src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png"
        alt={APP_INFO.name}
        className="mx-auto h-12 w-auto"
      />
      <h2 className="mt-6 text-2xl font-bold tracking-tight">
        Bienvenue sur {APP_INFO.name}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Connectez-vous pour accéder à votre bibliothèque
      </p>
    </div>
  );
}
