"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavePropertyButtonProps {
  propertyId: string;
  variant?: "default" | "outline" | "ghost";
  isSaved?: boolean;
}

export default function SavePropertyButton({ 
  propertyId, 
  variant = "default",
  isSaved = false 
}: SavePropertyButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSaveProperty = async () => {
    if (status === "authenticated") {
      // If user is logged in, save the property
      try {
        // API call to save property would go here
        setSaved(!saved);
      } catch (error) {
        console.error("Error saving property:", error);
      }
    } else {
      // If user is not logged in, show the auth dialog
      setShowAuthDialog(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleSaveProperty}
        className={`flex items-center ${saved ? "text-red-500" : ""}`}
      >
        <Heart className={`h-5 w-5 mr-1 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </Button>

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to save properties</AlertDialogTitle>
            <AlertDialogDescription>
              Create an account or sign in to save properties and get personalized recommendations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/auth/signin")}>
              Sign In
            </AlertDialogAction>
            <AlertDialogAction onClick={() => router.push("/auth/register")}>
              Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 