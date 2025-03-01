"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import { propertyService } from "@/services/api";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch property data
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getPropertyById(propertyId);
        setProperty(data);
      } catch (err: any) {
        console.error("Failed to fetch property:", err);
        setError("Failed to load property data. Please try again later.");
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
      {property && <PropertyForm initialData={property} isEditing={true} />}
    </div>
  );
} 