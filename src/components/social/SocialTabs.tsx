
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/social/activity/ActivityFeed";
import { FriendsList } from "@/components/social/friends/FriendsList";
import { FriendSearch } from "@/components/social/friends/FriendSearch";
import { DiscoverProfiles } from "@/components/social/discover/DiscoverProfiles";

export function SocialTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get active tab from URL parameters
  const getActiveTab = (): string => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return tab || "activity";
  };

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate(`/social?tab=${value}`, { replace: true });
  };

  return (
    <Tabs 
      defaultValue={getActiveTab()} 
      className="w-full" 
      onValueChange={handleTabChange}
    >
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="activity">Activité</TabsTrigger>
        <TabsTrigger value="friends">Amis</TabsTrigger>
        <TabsTrigger value="discover">Découvrir</TabsTrigger>
      </TabsList>
      
      <TabsContent value="activity" className="mt-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ActivityFeed />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="friends" className="mt-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <FriendsList />
            <div className="mt-8 pt-4 border-t border-border/30">
              <h3 className="text-lg font-medium mb-4">Trouver des amis</h3>
              <FriendSearch />
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="discover" className="mt-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <DiscoverProfiles />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
