
import React, { useState } from "react";
import { Search, UserPlus, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers, sendFriendRequest } from "@/services/media/social-service";
import { useDebounce } from "@/hooks/use-debounce";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FriendSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await searchUsers(searchTerm);
      if (!error) {
        setResults(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setPendingRequests(prev => new Set(prev).add(userId));
    
    try {
      await sendFriendRequest(userId);
      // Marquer comme demande envoyée dans les résultats
      setResults(results.map(user => 
        user.id === userId ? { ...user, requestSent: true } : user
      ));
    } finally {
      // On garde l'indication pour éviter de réenvoyer
    }
  };

  // Effectuer la recherche lorsque la valeur debouncée change
  React.useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des utilisateurs..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-secondary/20 rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              Recherchez des utilisateurs par leur nom
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-1">
              Aucun utilisateur trouvé
            </p>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier votre recherche
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-300px)]">
            <div className="p-1">
              {results.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      {user.fullName && (
                        <p className="text-xs text-muted-foreground">{user.fullName}</p>
                      )}
                    </div>
                  </div>
                  
                  {user.isFriend ? (
                    <Button variant="outline" size="sm" disabled>
                      Ami
                    </Button>
                  ) : user.requestSent || pendingRequests.has(user.id) ? (
                    <Button variant="outline" size="sm" disabled>
                      Demande envoyée
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleSendRequest(user.id)}
                      disabled={pendingRequests.has(user.id)}
                    >
                      {pendingRequests.has(user.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs">Ajouter</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
