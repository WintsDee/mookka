
import React, { useState, useEffect } from "react";
import { Users, User, UserPlus, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  getPopularProfiles, 
  getFriendSuggestions,
  sendFriendRequest
} from "@/services/media/social-service";
import { Link } from "react-router-dom";

export function DiscoverProfiles() {
  const [popularProfiles, setPopularProfiles] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const fetchPopularProfiles = async () => {
    setLoadingPopular(true);
    try {
      const { data, error } = await getPopularProfiles();
      if (!error) {
        setPopularProfiles(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPopular(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const { data, error } = await getFriendSuggestions();
      if (!error) {
        setSuggestions(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setPendingRequests(prev => new Set(prev).add(userId));
    
    try {
      await sendFriendRequest(userId);
      // Marquer comme demande envoyée dans les résultats
      setSuggestions(suggestions.map(user => 
        user.id === userId ? { ...user, requestSent: true } : user
      ));
    } finally {
      // On garde l'indication pour éviter de réenvoyer
    }
  };

  useEffect(() => {
    fetchPopularProfiles();
    fetchSuggestions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Profils populaires */}
      <section>
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          <h3 className="text-lg font-medium">Profils populaires</h3>
        </div>
        
        {loadingPopular ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-secondary/30 border-border/40">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-background mt-3" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-background rounded w-20 mx-auto" />
                    <div className="h-3 bg-background rounded w-24 mx-auto" />
                  </div>
                  <div className="h-8 w-full bg-background rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : popularProfiles.length === 0 ? (
          <Card className="bg-secondary/20 border-border/40">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Aucun profil populaire à afficher pour le moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {popularProfiles.map((profile) => (
              <Card key={profile.id} className="bg-secondary/30 border-border/40 hover:bg-secondary/40 transition-colors">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <Avatar className="w-16 h-16 mt-3">
                    <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{profile.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.followersCount || 0} abonné{profile.followersCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <Link to={`/profil/${profile.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Voir le profil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      {/* Suggestions d'amis */}
      <section>
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">Suggestions d'amis</h3>
        </div>
        
        {loadingSuggestions ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
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
        ) : suggestions.length === 0 ? (
          <Card className="bg-secondary/20 border-border/40">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Aucune suggestion d'ami à afficher pour le moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {suggestions.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/40 transition-colors"
              >
                <Link to={`/profil/${user.id}`} className="flex items-center gap-3">
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
                </Link>
                
                {user.requestSent || pendingRequests.has(user.id) ? (
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
        )}
      </section>
    </div>
  );
}
