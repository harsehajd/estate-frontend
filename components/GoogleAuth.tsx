"use client";

import { useEffect } from "react";

export default function GoogleAuth() {
  useEffect(() => {
    // Load the Google Platform Library
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  return null; // This component doesn't render anything
} 