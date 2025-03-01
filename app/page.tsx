"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Home, Search, Heart, Shield, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertySearch from "@/components/PropertySearch";
import Navigation from "@/components/Navigation";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Home className="h-10 w-10 text-blue-500" />,
      title: "Find Your Dream Home",
      description: "Browse thousands of properties that match your preferences and budget."
    },
    {
      icon: <Heart className="h-10 w-10 text-red-500" />,
      title: "Save Your Favorites",
      description: "Keep track of properties you love and get updates on price changes."
    },
    {
      icon: <MapPin className="h-10 w-10 text-green-500" />,
      title: "Explore Neighborhoods",
      description: "Discover detailed information about schools, safety, and amenities."
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-purple-500" />,
      title: "Market Insights",
      description: "Stay informed with the latest trends and data in the real estate market."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect Place to Call Home
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 animate-fade-in-delay">
              Discover thousands of properties for sale and rent across the country
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto mt-8 animate-fade-in-delay-2">
            <PropertySearch />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding your next home easier than ever with powerful tools and personalized recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-10 md:p-16 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of satisfied customers who found their perfect property with us
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <Link href="/properties/search">
                    Browse Properties <Search className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/auth/register">
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
