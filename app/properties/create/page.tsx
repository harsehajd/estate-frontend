"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";

export default function CreatePropertyPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>
      <PropertyForm />
    </div>
  );
} 