"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Estate
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/properties/search" className="text-gray-600 hover:text-blue-600">
              Browse Properties
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 