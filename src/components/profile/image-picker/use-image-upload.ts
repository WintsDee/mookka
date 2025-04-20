
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UploadError = {
  message: string;
  statusCode?: string;
  details?: string;
};

interface UploadResult {
  success: boolean;
  error?: UploadError;
  url?: string;
}

export const useImageUpload = (type: 'avatar' | 'cover', onChange: (url: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): UploadError | null => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        message: "Format de fichier non supporté",
        details: "Seuls les formats JPG, PNG et WEBP sont acceptés"
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        message: "Fichier trop volumineux",
        details: "La taille maximum est de 2Mo"
      };
    }

    return null;
  };

  const uploadImage = async (file: File): Promise<UploadResult> => {
    try {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: validationError.message,
          description: validationError.details,
          variant: "destructive",
        });
        return { success: false, error: validationError };
      }

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${type === 'avatar' ? 'avatars' : 'covers'}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw {
          message: "Erreur lors de l'upload",
          statusCode: uploadError.message,
          details: uploadError.message
        };
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw {
          message: "Erreur lors de la récupération de l'URL",
          details: "Impossible de générer l'URL publique"
        };
      }

      onChange(data.publicUrl);
      return { success: true, url: data.publicUrl };

    } catch (error: any) {
      const errorMessage = {
        message: error.message || "Erreur lors de l'upload",
        statusCode: error.statusCode,
        details: error.details
      };

      toast({
        title: errorMessage.message,
        description: errorMessage.details || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };

    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading
  };
};
