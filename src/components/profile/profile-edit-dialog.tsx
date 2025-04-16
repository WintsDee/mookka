
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, Image, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";
import { ProfileImagePicker } from "./profile-image-picker";

const profileSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  full_name: z.string().optional(),
  bio: z.string().max(160, "La bio ne peut pas dépasser 160 caractères").optional(),
  avatar_url: z.string().optional(),
  cover_image: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditDialogProps {
  profile: Profile;
  onUpdate: (values: Partial<Profile>) => Promise<void>;
}

export function ProfileEditDialog({ profile, onUpdate }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'cover'>('info');
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username,
      full_name: profile.full_name || "",
      bio: profile.bio || "",
      avatar_url: profile.avatar_url || DEFAULT_AVATAR,
      cover_image: profile.cover_image || DEFAULT_COVER
    }
  });
  
  async function onSubmit(values: ProfileFormValues) {
    await onUpdate(values);
    setOpen(false);
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b mb-4">
          <Button 
            variant={activeTab === 'info' ? "default" : "ghost"}
            onClick={() => setActiveTab('info')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            data-state={activeTab === 'info' ? 'active' : 'inactive'}
          >
            Informations
          </Button>
          <Button 
            variant={activeTab === 'avatar' ? "default" : "ghost"}
            onClick={() => setActiveTab('avatar')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            data-state={activeTab === 'avatar' ? 'active' : 'inactive'}
          >
            <Image size={16} className="mr-2" />
            Avatar
          </Button>
          <Button 
            variant={activeTab === 'cover' ? "default" : "ghost"}
            onClick={() => setActiveTab('cover')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            data-state={activeTab === 'cover' ? 'active' : 'inactive'}
          >
            <ImageIcon size={16} className="mr-2" />
            Bannière
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {activeTab === 'info' && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {activeTab === 'avatar' && (
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image de profil</FormLabel>
                    <FormControl>
                      <ProfileImagePicker 
                        value={field.value} 
                        onChange={field.onChange}
                        type="avatar"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {activeTab === 'cover' && (
              <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image de couverture</FormLabel>
                    <FormControl>
                      <ProfileImagePicker 
                        value={field.value} 
                        onChange={field.onChange}
                        type="cover"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
