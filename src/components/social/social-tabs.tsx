
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SocialTabsProps {
  children: React.ReactNode;
}

export const SocialTabs = ({ children }: SocialTabsProps) => {
  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="activity">Activité</TabsTrigger>
        <TabsTrigger value="friends">Amis</TabsTrigger>
        <TabsTrigger value="discover">Découvrir</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export const ComingSoonTab = () => (
  <div className="flex flex-col items-center justify-center h-40 text-center px-6">
    <p className="text-muted-foreground">
      Fonctionnalité à venir dans la prochaine mise à jour
    </p>
  </div>
);
