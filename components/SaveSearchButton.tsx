"use client";

import { useState } from "react";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveSearchButtonProps {
  searchParams: Record<string, string>;
  variant?: "default" | "outline" | "ghost";
}

export default function SaveSearchButton({ 
  searchParams, 
  variant = "outline" 
}: SaveSearchButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleSaveSearch = async () => {
    // Simple toggle without authentication
    setSaved(!saved);
    alert("Search saved!");
  };

  return (
    <Button
      variant={variant}
      onClick={handleSaveSearch}
      className="flex items-center"
    >
      <BookmarkPlus className="h-5 w-5 mr-1" />
      {saved ? "Saved" : "Save Search"}
    </Button>
  );
} 