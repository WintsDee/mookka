
import React, { useState, useEffect } from "react";
import { Loader2, UserMinus, User, Search, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserFriends, removeFriend, Friend } from "@/services/media/social-service";
import { FriendRequests } from "./FriendRequests";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

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
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher parmi vos amis..."
          className="pl-9 bg-secondary/20 border-secondary/30 focus-visible:ring-primary/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Section demandes d'amitié */}
      <FriendRequests onRequestProcessed={handleRefresh} />
      
      {/* Liste des amis */}
      <Card className="p-4 bg-secondary/10 border-secondary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary/80" />
            <h3 className="text-lg font-medium">Vos amis</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="text-xs hover:bg-secondary/20"
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary/70" />
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
                  <Button className="bg-primary/80 hover:bg-primary">Découvrir des utilisateurs</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-440px)] md:h-[calc(100vh-400px)]">
            <div className="grid gap-2 grid-cols-1">
              {filteredFriends.map((friend) => (
                <div 
                  key={friend.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/40 transition-colors"
                >
                  <Link to={`/profil/${friend.id}`} className="flex items-center gap-3 flex-1">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarImage src={friend.avatarUrl} alt={friend.username} />
                      <AvatarFallback className="bg-primary/10 text-primary/80">
                        {friend.username.charAt(0).toUpperCase()}
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
      </Card>
    </div>
  );
}
