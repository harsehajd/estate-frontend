"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);

  const handleSaveProperty = async () => {
    // Simple toggle without authentication
    setSaved(!saved);
  };

  return (
    <Button
      variant={variant}
      onClick={handleSaveProperty}
      className={`flex items-center ${saved ? "text-red-500" : ""}`}
    >
      <Heart className={`h-5 w-5 mr-1 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
} 