"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface SavePropertyButtonProps {
  propertyId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function SavePropertyButton({
  propertyId,
  variant = "outline",
  size = "icon",
}: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if property is already saved when component mounts
    const checkSavedStatus = async () => {
      if (!user) return;
      
      try {
        const saved = await propertyService.checkIfSaved(propertyId);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [propertyId, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSaved) {
        await propertyService.unsaveProperty(propertyId);
        setIsSaved(false);
      } else {
        await propertyService.saveProperty(propertyId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSaveToggle}
      disabled={isLoading}
      aria-label={isSaved ? "Unsave property" : "Save property"}
      className={isSaved ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
    </Button>
  );
} 