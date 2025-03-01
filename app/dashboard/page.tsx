"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

export default function Dashboard() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Properties</CardTitle>
              <CardDescription>Properties you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">You haven't saved any properties yet.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Saved Searches</CardTitle>
              <CardDescription>Your saved search criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">You haven't saved any searches yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 