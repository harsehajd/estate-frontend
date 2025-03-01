"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookmarkPlus } from "lucide-react";
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

interface SaveSearchButtonProps {
  searchParams: Record<string, string>;
  variant?: "default" | "outline" | "ghost";
}

export default function SaveSearchButton({ 
  searchParams, 
  variant = "outline" 
}: SaveSearchButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSaveSearch = async () => {
    if (status === "authenticated") {
      // If user is logged in, save the search
      try {
        // API call to save search would go here
        alert("Search saved successfully!");
      } catch (error) {
        console.error("Error saving search:", error);
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
        onClick={handleSaveSearch}
        className="flex items-center"
      >
        <BookmarkPlus className="h-5 w-5 mr-1" />
        Save Search
      </Button>

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to save searches</AlertDialogTitle>
            <AlertDialogDescription>
              Create an account or sign in to save your search criteria and get notified when new properties match.
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