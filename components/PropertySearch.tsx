"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Define housing priorities
const housingPriorities = [
  { id: "price", label: "Affordable Price" },
  { id: "schools", label: "Good School District" },
  { id: "proximity", label: "Proximity to City Center" },
  { id: "transport", label: "Public Transportation" },
  { id: "safety", label: "Neighborhood Safety" },
  { id: "amenities", label: "Local Amenities" },
  { id: "size", label: "Property Size" },
  { id: "new", label: "New Construction" },
  { id: "green", label: "Green Spaces Nearby" },
];

export default function PropertySearch() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    query: "",
    type: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
  });
  
  // State for priorities
  const [priorities, setPriorities] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePriorityChange = (priorityId: string, checked: boolean) => {
    if (checked) {
      setPriorities((prev) => [...prev, priorityId]);
    } else {
      setPriorities((prev) => prev.filter(id => id !== priorityId));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string
    const params = new URLSearchParams();
    if (searchParams.query) params.append("query", searchParams.query);
    if (searchParams.type !== "all") params.append("type", searchParams.type);
    if (searchParams.minPrice) params.append("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.append("maxPrice", searchParams.maxPrice);
    if (searchParams.bedrooms !== "any") params.append("bedrooms", searchParams.bedrooms);
    
    // Add priorities to query string
    if (priorities.length > 0) {
      params.append("priorities", priorities.join(","));
    }
    
    // Navigate to search results page
    router.push(`/properties/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Find Your Dream Home</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <Label htmlFor="query">Search</Label>
          <Input
            id="query"
            name="query"
            placeholder="Location, keyword, or property ID"
            value={searchParams.query}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="type">Property Type</Label>
            <Select
              value={searchParams.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="Min Price"
              value={searchParams.minPrice}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="Max Price"
              value={searchParams.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select
            value={searchParams.bedrooms}
            onValueChange={(value) => handleSelectChange("bedrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block mb-2">Housing Priorities</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {housingPriorities.map((priority) => (
              <div key={priority.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`priority-${priority.id}`}
                  checked={priorities.includes(priority.id)}
                  onCheckedChange={(checked) => 
                    handlePriorityChange(priority.id, checked === true)
                  }
                />
                <label 
                  htmlFor={`priority-${priority.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {priority.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Search Properties</Button>
      </form>
    </div>
  );
} 