
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

      // Instead of uploading to storage, we'll convert to base64 and use that directly
      // This avoids RLS issues with storage buckets
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          if (base64String) {
            onChange(base64String);
            resolve({ success: true, url: base64String });
          } else {
            const error = {
              message: "Erreur lors de la conversion",
              details: "Impossible de convertir l'image"
            };
            toast({
              title: error.message,
              description: error.details,
              variant: "destructive",
            });
            resolve({ success: false, error });
          }
          setIsUploading(false);
        };
        
        reader.onerror = () => {
          const error = {
            message: "Erreur lors de la lecture",
            details: "Impossible de lire le fichier"
          };
          toast({
            title: error.message,
            description: error.details,
            variant: "destructive",
          });
          resolve({ success: false, error });
          setIsUploading(false);
        };
        
        reader.readAsDataURL(file);
      });

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

      setIsUploading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    uploadImage,
    isUploading
  };
};
