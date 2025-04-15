
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { mockSocial, mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PageTitle } from "@/components/page-title";
import { MobileHeader } from "@/components/mobile-header";

const Social = () => {
  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <PageTitle title="Social" />
          
          <div className="mt-4">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="friends">Amis</TabsTrigger>
                <TabsTrigger value="discover">Découvrir</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4 px-1">
                    {mockSocial.map((activity) => {
                      const media = mockMedia.find(m => m.id === activity.media.id);
                      
                      return (
                        <Card key={activity.id} className="bg-secondary/40 border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={activity.user.avatar} 
                                alt={activity.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm">
                                  <span className="font-medium">{activity.user.name}</span>{" "}
                                  {activity.action}{" "}
                                  <span className="font-medium">{activity.media.title}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(activity.timestamp), { 
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            {media && (
                              <div className="mt-3 flex items-center gap-3">
                                <img
                                  src={media.coverImage}
                                  alt={media.title}
                                  className="w-16 h-24 rounded-md object-cover"
                                />
                                <div>
                                  <h3 className="font-medium text-sm">{media.title}</h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {media.description?.slice(0, 80)}...
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-between mt-4">
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                                <Heart size={14} />
                                <span>J'aime</span>
                              </button>
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                                <MessageCircle size={14} />
                                <span>Commenter</span>
                              </button>
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                                <Share2 size={14} />
                                <span>Partager</span>
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="friends">
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir dans la prochaine mise à jour
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="discover">
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir dans la prochaine mise à jour
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Social;
