"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { propertyService } from "@/services/api";
import { useAuth } from "@/lib/auth-context";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url?: string;
  type?: string;
}

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/dashboard/saved");
      return;
    }

    const fetchSavedProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      setError("");
      
      try {
        const data = await propertyService.getSavedProperties();
        setProperties(data);
      } catch (err: any) {
        console.error("Failed to fetch saved properties:", err);
        setError("Failed to load your saved properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedProperties();
    }
  }, [user, authLoading, router]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saved Properties</h1>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading saved properties...</p>
        </div>
      ) : error && properties.length === 0 ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">You haven't saved any properties yet</p>
          <p className="mt-2 text-gray-400">Browse properties and click the heart icon to save them</p>
          <Button 
            onClick={() => router.push("/properties/search")}
            className="mt-4"
          >
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
} 