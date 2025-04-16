
import React, { useState, useEffect } from "react";
import { Loader2, UserMinus, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserFriends, removeFriend, Friend } from "@/services/media/social-service";
import { FriendRequests } from "./FriendRequests";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data, error } = await getUserFriends();
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos amis",
          variant: "destructive"
        });
      } else {
        setFriends(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };

  const handleRemoveFriend = async (friendId: string) => {
    const { success } = await removeFriend(friendId);
    if (success) {
      setFriends(friends.filter(friend => friend.id !== friendId));
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Filtrer les amis en fonction de la recherche
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  return (
    <div className="space-y-6 my-2">
      {/* Recherche amis */}
      <div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher parmi vos amis..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Section demandes d'amitié */}
      <FriendRequests onRequestProcessed={handleRefresh} />
      
      {/* Liste des amis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Vos amis</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            {refreshing && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
            Actualiser
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-background rounded" />
                    <div className="h-3 w-16 bg-background rounded" />
                  </div>
                </div>
                <div className="w-20 h-8 bg-background rounded" />
              </div>
            ))}
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-8 bg-secondary/20 rounded-lg">
            <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            {searchQuery ? (
              <p className="text-muted-foreground">
                Aucun ami trouvé pour "{searchQuery}"
              </p>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore d'amis sur Mookka
                </p>
                <Link to="/social?tab=discover">
                  <Button>Découvrir des utilisateurs</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-2">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <Link to={`/profil/${friend.id}`} className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={friend.avatarUrl} alt={friend.username} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.status === 'accepted' ? 'Ami' : friend.status}
                      </p>
                    </div>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    <span className="text-xs">Retirer</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
