
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TypeSpecificFieldsProps {
  mediaType: string;
  form: UseFormReturn<any>;
}

export const TypeSpecificFields = ({ mediaType, form }: TypeSpecificFieldsProps) => {
  switch (mediaType) {
    case "film":
      return <FilmFields form={form} />;
    case "serie":
      return <SerieFields form={form} />;
    case "book":
      return <BookFields form={form} />;
    case "game":
      return <GameFields form={form} />;
    default:
      return null;
  }
};

const FilmFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <FormField
      control={form.control}
      name="director"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Réalisateur</FormLabel>
          <FormControl>
            <Input placeholder="Nom du réalisateur" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const SerieFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <FormField
      control={form.control}
      name="creator"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Créateur</FormLabel>
          <FormControl>
            <Input placeholder="Nom du créateur" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const BookFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <FormField
      control={form.control}
      name="author"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Auteur</FormLabel>
          <FormControl>
            <Input placeholder="Nom de l'auteur" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const GameFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="publisher"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Éditeur</FormLabel>
            <FormControl>
              <Input placeholder="Nom de l'éditeur" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plateforme</FormLabel>
            <FormControl>
              <Input placeholder="PS5, Xbox, PC, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
