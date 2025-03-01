"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authService, propertyService, supabase } from "@/services/api";
import PropertySearch from "@/components/PropertySearch";

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
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth/login");
        return;
      }
      
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Fetch properties
      try {
        const data = await propertyService.getProperties();
        setProperties(data);
      } catch (err: any) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again later.");
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          await supabase.auth.signOut();
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push("/auth/login");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <div className="space-x-4">
          <Button onClick={() => router.push("/properties/create")}>
            Add New Property
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {user && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            Welcome, <span className="font-semibold">{user.user_metadata?.name || user.email}</span>!
          </p>
        </div>
      )}
      
      <div className="mb-8">
        <PropertySearch />
      </div>

      <div className="mb-8 flex space-x-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/saved")}>
          Saved Properties
        </Button>
        <Button variant="outline" onClick={() => router.push("/properties/search")}>
          Search Properties
        </Button>
      </div>

      {error && properties.length === 0 ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold mb-4">Your Properties</h2>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No properties found</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/properties/create")}
          >
            Add Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={property.image_url} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
                <CardDescription>${property.price.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{property.address}</p>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
                <p className="mt-4 text-gray-600 line-clamp-2">{property.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/properties/${property.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/properties/${property.id}/edit`)}
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 