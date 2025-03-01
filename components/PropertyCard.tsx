import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SavePropertyButton from "@/components/SavePropertyButton";
import Link from "next/link";

interface PropertyCardProps {
  property: {
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
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      {property.image_url && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={property.image_url} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <SavePropertyButton propertyId={property.id} />
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{property.title}</CardTitle>
            <CardDescription>${property.price.toLocaleString()}</CardDescription>
          </div>
          {!property.image_url && (
            <SavePropertyButton propertyId={property.id} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-2">{property.address}</p>
        <div className="flex space-x-4 text-sm text-gray-500">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.area} sqft</span>
          {property.type && <span>{property.type}</span>}
        </div>
        <p className="mt-4 text-gray-600 line-clamp-2">{property.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          asChild
          className="w-full"
        >
          <Link href={`/properties/${property.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 