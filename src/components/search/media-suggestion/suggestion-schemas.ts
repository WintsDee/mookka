
import { z } from "zod";
import { MediaType } from "@/types";

// Base schema for all media types
export const baseSchema = z.object({
  title: z.string().min(2, { message: "Le titre est requis" }),
  year: z.string().regex(/^\d{4}$/, { message: "L'année doit être au format YYYY" }).optional(),
  description: z.string().optional(),
  coverUrl: z.string().url({ message: "L'URL de la couverture doit être valide" }).optional().or(z.literal("")),
  confirmNonExistent: z.boolean().refine(val => val === true, {
    message: "Veuillez confirmer que ce média n'existe pas déjà dans la base de données"
  })
});

// Film schema
export const filmSchema = baseSchema.extend({
  director: z.string().min(2, { message: "Le réalisateur est requis" }),
});

// Serie schema
export const serieSchema = baseSchema.extend({
  creator: z.string().min(2, { message: "Le créateur est requis" }),
});

// Book schema
export const bookSchema = baseSchema.extend({
  author: z.string().min(2, { message: "L'auteur est requis" }),
});

// Game schema
export const gameSchema = baseSchema.extend({
  publisher: z.string().min(2, { message: "L'éditeur est requis" }),
  platform: z.string().min(2, { message: "La plateforme est requise" }),
});

// Get the appropriate form schema based on media type
export const getFormSchema = (mediaType: MediaType | "") => {
  switch (mediaType) {
    case "film":
      return filmSchema;
    case "serie":
      return serieSchema;
    case "book":
      return bookSchema;
    case "game":
      return gameSchema;
    default:
      return baseSchema;
  }
};

// Get default values based on media type
export const getDefaultValues = (mediaType: MediaType | "") => {
  const baseDefaults = {
    title: "",
    year: "",
    description: "",
    coverUrl: "",
    confirmNonExistent: false,
  };

  switch (mediaType) {
    case "film":
      return { ...baseDefaults, director: "" };
    case "serie":
      return { ...baseDefaults, creator: "" };
    case "book":
      return { ...baseDefaults, author: "" };
    case "game":
      return { ...baseDefaults, publisher: "", platform: "" };
    default:
      return baseDefaults;
  }
};
