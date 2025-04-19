
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileActionsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const ProfileActions = ({ isAuthenticated, onLogout }: ProfileActionsProps) => {
  if (!isAuthenticated) {
    return (
      <div className="mt-8 space-y-4">
        <Link to="/soutenir" className="block">
          <Button className="w-full" size="lg" variant="default">
            Soutenir le projet
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <Link to="/soutenir" className="block">
        <Button className="w-full" size="lg" variant="default">
          Soutenir le projet
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full" size="lg">
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Se déconnecter ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>Se déconnecter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
