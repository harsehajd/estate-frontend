"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/api";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";

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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Only fetch properties if there are search parameters
    if (searchParams.size > 0) {
      fetchProperties();
      setHasSearched(true);
    }
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Convert searchParams to object
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      // Handle priorities separately if needed
      if (params.priorities) {
        const prioritiesList = params.priorities.split(',');
        console.log('Selected priorities:', prioritiesList);
        // You can use these priorities to filter or sort results
      }
      
      const data = await propertyService.searchProperties(params);
      setProperties(data);
    } catch (err: any) {
      console.error("Failed to fetch properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Property Search Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PropertySearch />
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              {hasSearched ? (
                <>
                  <p className="text-xl text-gray-500">No properties found matching your criteria</p>
                  <p className="mt-2 text-gray-400">Try adjusting your search filters</p>
                </>
              ) : (
                <p className="text-xl text-gray-500">Use the search form to find properties</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 