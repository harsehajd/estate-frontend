"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Get the session from the URL
    const setSession = async () => {
      try {
        // The session will be automatically set by Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Redirect to dashboard after successful authentication
          router.push('/dashboard');
        } else {
          // If no session, redirect to login
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error setting session:', error);
        router.push('/auth/login');
      }
    };
    
    setSession();
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Completing authentication, please wait...</p>
    </div>
  );
} 