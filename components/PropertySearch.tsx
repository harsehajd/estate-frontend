"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Home, Bed, DollarSign, Check } from "lucide-react";

// Define housing priorities
const housingPriorities = [
  { id: "price", label: "Affordable Price", icon: <DollarSign className="h-4 w-4 mr-1" /> },
  { id: "schools", label: "Good School District", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "proximity", label: "Proximity to City Center", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "transport", label: "Public Transportation", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "safety", label: "Neighborhood Safety", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "amenities", label: "Local Amenities", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "size", label: "Property Size", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "new", label: "New Construction", icon: <Check className="h-4 w-4 mr-1" /> },
  { id: "green", label: "Green Spaces Nearby", icon: <Check className="h-4 w-4 mr-1" /> },
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
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Home className="mr-2 h-6 w-6" />
          Find Your Dream Home
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-5">
          <div className="relative">
            <Label htmlFor="query" className="text-sm font-medium mb-1 block">
              Search Location or Keywords
            </Label>
            <div className="relative">
              <Input
                id="query"
                name="query"
                placeholder="City, neighborhood, or keyword"
                value={searchParams.query}
                onChange={handleChange}
                className="pl-10 py-6 text-base"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type" className="text-sm font-medium mb-1 block">
                Property Type
              </Label>
              <Select
                value={searchParams.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="py-5">
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
              <Label htmlFor="minPrice" className="text-sm font-medium mb-1 block">
                Min Price
              </Label>
              <div className="relative">
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  placeholder="Min Price"
                  value={searchParams.minPrice}
                  onChange={handleChange}
                  className="pl-10 py-5"
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="maxPrice" className="text-sm font-medium mb-1 block">
                Max Price
              </Label>
              <div className="relative">
                <Input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  placeholder="Max Price"
                  value={searchParams.maxPrice}
                  onChange={handleChange}
                  className="pl-10 py-5"
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="bedrooms" className="text-sm font-medium mb-1 block">
              Bedrooms
            </Label>
            <div className="relative">
              <Select
                value={searchParams.bedrooms}
                onValueChange={(value) => handleSelectChange("bedrooms", value)}
              >
                <SelectTrigger className="py-5 pl-10">
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
              <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Housing Priorities
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {housingPriorities.map((priority) => (
                <div 
                  key={priority.id} 
                  className={`flex items-center p-2 rounded-md border transition-colors ${
                    priorities.includes(priority.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox 
                    id={`priority-${priority.id}`}
                    checked={priorities.includes(priority.id)}
                    onCheckedChange={(checked) => 
                      handlePriorityChange(priority.id, checked === true)
                    }
                    className="h-4 w-4 flex-shrink-0 mr-2"
                  />
                  <label 
                    htmlFor={`priority-${priority.id}`}
                    className="text-sm font-medium cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis flex items-center"
                  >
                    {priority.icon}
                    {priority.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 