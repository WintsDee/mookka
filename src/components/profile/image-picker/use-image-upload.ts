
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useImageUpload = (type: 'avatar' | 'cover', onChange: (url: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${type === 'avatar' ? 'avatars' : 'covers'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onChange(data.publicUrl);
      }

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'upload",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
