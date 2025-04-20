
import { Input } from "@/components/ui/input";

interface UsernameFieldProps {
  username: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkingUsername: boolean;
  usernameExists: boolean;
}

export function UsernameField({ 
  username, 
  onChange, 
  checkingUsername, 
  usernameExists 
}: UsernameFieldProps) {
  return (
    <div>
      <label htmlFor="username" className="block text-sm font-medium mb-2 text-white">
        Nom d'utilisateur
      </label>
      <Input
        id="username"
        value={username}
        onChange={onChange}
        required
        minLength={3}
        maxLength={30}
        className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
          usernameExists ? "border-destructive" : ""
        }`}
      />
      {checkingUsername && (
        <p className="text-xs text-white/70 mt-1">Vérification en cours...</p>
      )}
      {usernameExists && !checkingUsername && (
        <p className="text-xs text-destructive mt-1">Ce nom d'utilisateur est déjà pris</p>
      )}
      {!usernameExists && username.length >= 3 && !checkingUsername && (
        <p className="text-xs text-green-500 mt-1">Ce nom d'utilisateur est disponible</p>
      )}
    </div>
  );
}
