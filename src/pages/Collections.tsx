
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionGrid } from "@/components/collections/collection-grid";
import { CollectionType, CollectionVisibility } from "@/types/collection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, Search } from "lucide-react";
import { useCollections } from "@/hooks/use-collections";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";

const Collections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "followed" | "community">("personal");
  const [collectionType, setCollectionType] = useState<CollectionType | "all">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const {
    myCollections,
    followedCollections,
    publicCollections,
    loadingMyCollections,
    loadingFollowedCollections,
    loadingPublicCollections,
    createCollection,
    isCreatingCollection
  } = useCollections();
  
  // Filter collections based on criteria
  const filterCollections = (collections) => {
    return collections
      .filter(collection => 
        searchTerm === "" || 
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(collection => 
        collectionType === "all" || collection.type === collectionType
      );
  };
  
  const filteredPersonalCollections = filterCollections(myCollections);
  const filteredFollowedCollections = filterCollections(followedCollections || []);
  const filteredCommunityCollections = filterCollections(publicCollections);
  
  const handleCreateCollection = (data) => {
    createCollection(data);
    setCreateDialogOpen(false);
  };
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    // Reset filters when tab changes
    setCollectionType("all");
  };

  return (
    <Background>
      <MobileHeader title="Collections" />
      
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="mt-4 relative flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Rechercher dans les collections..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setCreateDialogOpen(true)}
              className="flex-shrink-0"
            >
              <PlusIcon size={20} />
            </Button>
          </div>
          
          <div className="mt-4">
            <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="personal" className="text-xs">
                  Mes collections
                </TabsTrigger>
                <TabsTrigger value="followed" className="text-xs">
                  Suivies
                </TabsTrigger>
                <TabsTrigger value="community" className="text-xs">
                  Communauté
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(100vh-260px)] mt-4">
                <TabsContent value="personal" className="mt-2">
                  <CollectionGrid
                    collections={filteredPersonalCollections}
                    loading={loadingMyCollections}
                    emptyMessage="Vous n'avez pas encore créé de collection."
                    className="mb-6"
                  />
                </TabsContent>
                
                <TabsContent value="followed" className="mt-2">
                  <CollectionGrid
                    collections={filteredFollowedCollections}
                    loading={loadingFollowedCollections}
                    emptyMessage="Vous ne suivez aucune collection pour le moment."
                    className="mb-6"
                  />
                </TabsContent>
                
                <TabsContent value="community" className="mt-2">
                  <CollectionGrid
                    collections={filteredCommunityCollections}
                    loading={loadingPublicCollections}
                    emptyMessage="Aucune collection communautaire trouvée."
                    className="mb-6"
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </header>
      </div>
      
      <CreateCollectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCollection}
        isLoading={isCreatingCollection}
      />
      
      <MobileNav />
    </Background>
  );
};

export default Collections;
