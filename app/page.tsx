"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/house-icon.svg" 
            alt="Estate Logo"
            width={32}
            height={32}
            priority
          />
          <h1 className="text-2xl font-bold">HomeFindr</h1>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/properties" className="hover:underline">Properties</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-col md:flex-row gap-12 items-center justify-center">
        <div className="flex-1 max-w-md">
          <h2 className="text-3xl font-bold mb-4">Find Your Dream Home</h2>
          <p className="text-lg mb-6">
            Discover properties that match your needs and get personalized mortgage analysis.
          </p>
          <div className="hidden sm:block">
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Personalized property recommendations</li>
              <li>Detailed mortgage calculations</li>
              <li>Expert insights on neighborhoods</li>
              <li>Save your favorite properties</li>
            </ul>
          </div>
          
          <Button asChild className="mt-4">
            <Link href={user ? "/dashboard" : "/auth/register"}>
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
        </div>

        <div className="flex-1 max-w-md">
          <Image
            src="/house-illustration.svg"
            alt="House Illustration"
            width={500}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </main>

      <footer className="flex justify-center items-center gap-6 text-sm text-gray-500">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <p>© 2023 HomeFindr. All rights reserved.</p>
      </footer>
    </div>
  );
}
