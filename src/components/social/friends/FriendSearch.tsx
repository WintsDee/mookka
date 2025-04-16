
import React, { useState } from "react";
import { Search, UserPlus, Loader2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers, sendFriendRequest } from "@/services/media/social-service";
import { useDebounce } from "@/hooks/use-debounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4 bg-secondary/10 border-secondary/20">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary/80" />
        <h3 className="text-lg font-medium">Trouver des amis</h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des utilisateurs..."
            className="pl-9 bg-secondary/20 border-secondary/30 focus-visible:ring-primary/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 bg-secondary/20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Recherche en cours...</p>
            </div>
          ) : !query.trim() ? (
            <div className="text-center py-10 bg-secondary/20 rounded-lg">
              <Search className="h-10 w-10 text-primary/40 mx-auto mb-3" />
              <p className="text-base text-muted-foreground">
                Recherchez des utilisateurs pour les ajouter en ami
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 bg-secondary/20 rounded-lg">
              <User className="h-10 w-10 text-primary/40 mx-auto mb-3" />
              <p className="text-base text-muted-foreground mb-1">
                Aucun utilisateur trouvé
              </p>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier votre recherche
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-340px)] md:max-h-[calc(100vh-300px)] bg-secondary/20 rounded-lg">
              <div className="p-1">
                {results.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-primary/20">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback className="bg-primary/10 text-primary/80">
                          {user.username.charAt(0).toUpperCase()}
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
                      <Button variant="outline" size="sm" disabled className="text-xs bg-transparent border-primary/30 text-primary/70">
                        Ami
                      </Button>
                    ) : user.requestSent || pendingRequests.has(user.id) ? (
                      <Button variant="outline" size="sm" disabled className="text-xs bg-transparent border-primary/30 text-primary/70">
                        Demande envoyée
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={pendingRequests.has(user.id)}
                        className="bg-primary/80 hover:bg-primary text-xs"
                      >
                        {pendingRequests.has(user.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <UserPlus className="h-3 w-3 mr-1" />
                        )}
                        <span>Ajouter</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </Card>
  );
}
