"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [expandedQuery, setExpandedQuery] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"initial" | "questions" | "results">("initial");
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

  // Handle the initial query submission
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:8000/api/expand-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setExpandedQuery(data.expanded_query);
      setClarifyingQuestions(data.clarifying_questions);
      setResponses(new Array(data.clarifying_questions.length).fill(""));
      setStep("questions");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle the submission of responses to clarifying questions
  const handleResponsesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (responses.some(r => !r.trim())) {
      setError("Please answer all questions");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:8000/api/search-with-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_query: query,
          responses,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // The API returns a JSON string that needs to be parsed
      const rawData = await response.json();
      console.log("API Response (raw):", rawData);
      
      // Parse the string response into a JavaScript array
      let propertyData: any[] = [];
      
      try {
        // If the response is a string, parse it as JSON
        if (typeof rawData === 'string') {
          propertyData = JSON.parse(rawData);
          console.log("Parsed property data:", propertyData);
        } 
        // If it's already an array, use it directly
        else if (Array.isArray(rawData)) {
          propertyData = rawData;
        } 
        // If it's an object with a properties or results field
        else if (rawData && typeof rawData === 'object') {
          if (Array.isArray(rawData.properties)) {
            propertyData = rawData.properties;
          } else if (Array.isArray(rawData.results)) {
            propertyData = rawData.results;
          } else {
            // If it's a single property object, wrap it in an array
            propertyData = [rawData];
          }
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        setError(`Failed to parse property data: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        propertyData = [];
      }
      
      // Initialize the active image index for each property
      const initialActiveImages: Record<number, number> = {};
      
      // Set active image index for each property
      propertyData.forEach((_, index) => {
        initialActiveImages[index] = 0;
      });
      
      setProperties(propertyData);
      setActiveImageIndex(initialActiveImages);
      setStep("results");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle response input changes
  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  // Reset the search
  const handleReset = () => {
    setQuery("");
    setExpandedQuery("");
    setClarifyingQuestions([]);
    setResponses([]);
    setProperties([]);
    setError("");
    setStep("initial");
  };

  // Handle image carousel navigation
  const nextImage = (propertyIndex: number, totalImages: number) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [propertyIndex]: (prev[propertyIndex] + 1) % totalImages
    }));
  };

  const prevImage = (propertyIndex: number, totalImages: number) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [propertyIndex]: (prev[propertyIndex] - 1 + totalImages) % totalImages
    }));
  };

  // Parse image URLs from the property data
  const getImageUrls = (property: any) => {
    const images: string[] = [];
    
    if (property.primary_photo) {
      images.push(property.primary_photo);
    }
    
    if (property.alt_photos) {
      const altPhotos = typeof property.alt_photos === 'string' 
        ? property.alt_photos.split(', ') 
        : property.alt_photos;
      
      // Add unique images only (avoid duplicates with primary photo)
      altPhotos.forEach((photo: string) => {
        if (!images.includes(photo)) {
          images.push(photo);
        }
      });
    }
    
    return images;
  };

  // Format price with commas
  const formatPrice = (price: number) => {
    return price ? `$${price.toLocaleString()}` : "N/A";
  };

  // Get property status display text
  const getStatusDisplay = (status: string) => {
    if (!status) return "Unknown";
    
    const statusMap: Record<string, string> = {
      "FOR_SALE": "For Sale",
      "FOR_RENT": "For Rent",
      "SOLD": "Sold",
      "PENDING": "Pending",
      "CONTINGENT": "Contingent"
    };
    
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">Real Estate Search</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Find your dream property using natural language
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {step === "initial" && (
          <form onSubmit={handleQuerySubmit} className="mb-8">
            <div className="flex flex-col gap-4">
              <label htmlFor="query" className="text-lg font-medium">
                What kind of property are you looking for?
              </label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Find me a 3 bedroom house in Seattle under $800k"
                className="p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-12 px-5 disabled:opacity-50 shadow-[0_0_0_3px_rgba(59,130,246,0.3)] hover:shadow-[0_0_0_5px_rgba(59,130,246,0.4)] focus:shadow-[0_0_0_5px_rgba(59,130,246,0.4)] outline-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Search Properties"}
              </button>
            </div>
          </form>
        )}

        {step === "questions" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Let's clarify your search</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{expandedQuery}</p>
            
            <form onSubmit={handleResponsesSubmit} className="flex flex-col gap-4">
              {clarifyingQuestions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label htmlFor={`response-${index}`} className="block mb-2 font-medium">
                    {question}
                  </label>
                  <input
                    id={`response-${index}`}
                    type="text"
                    value={responses[index]}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                    className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-all flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base h-12 px-5 focus:shadow-[0_0_0_3px_rgba(156,163,175,0.3)] outline-none"
                >
                  Start Over
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-12 px-5 disabled:opacity-50 shadow-[0_0_0_3px_rgba(59,130,246,0.3)] hover:shadow-[0_0_0_5px_rgba(59,130,246,0.4)] focus:shadow-[0_0_0_5px_rgba(59,130,246,0.4)] outline-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : "Find Properties"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "results" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <button
                onClick={handleReset}
                className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-all flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-sm h-10 px-4 focus:shadow-[0_0_0_3px_rgba(156,163,175,0.3)] outline-none"
              >
                New Search
              </button>
            </div>
            
            {properties.length === 0 ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                No properties found matching your criteria.
              </p>
            ) : (
              <div className="grid gap-8">
                {properties.map((property, propertyIndex) => {
                  const images = getImageUrls(property);
                  const activeImage = activeImageIndex[propertyIndex] || 0;
                  
                  return (
                    <div key={propertyIndex} className="border rounded-lg overflow-hidden dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                      {/* Image Carousel */}
                      <div className="relative h-64 sm:h-80 bg-gray-200 dark:bg-gray-800">
                        {images.length > 0 ? (
                          <>
                            <img 
                              src={images[activeImage]} 
                              alt={`Property at ${property.full_street_line || property.street || 'Unknown location'}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Image Navigation */}
                            {images.length > 1 && (
                              <>
                                <button 
                                  onClick={() => prevImage(propertyIndex, images.length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                  aria-label="Previous image"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => nextImage(propertyIndex, images.length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                  aria-label="Next image"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </button>
                                
                                {/* Image Counter */}
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                  {activeImage + 1} / {images.length}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No images available
                          </div>
                        )}
                      </div>
                      
                      {/* Property Details */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">
                            {formatPrice(property.list_price)}
                          </h3>
                          <div className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                            {getStatusDisplay(property.status)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {property.full_street_line || property.street}{property.unit ? `, ${property.unit}` : ''}, {property.city}, {property.state} {property.zip_code}
                        </p>
                        
                        {/* Property Specs */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                            </svg>
                            <span>{property.beds || 'N/A'} beds</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{property.full_baths || 'N/A'} baths</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                            <span>{property.sqft ? `${property.sqft.toLocaleString()} sqft` : 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            <span>Built {property.year_built || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {/* Property Description */}
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {property.text || property.description || "No description available"}
                          </p>
                        </div>
                        
                        {/* Property Link */}
                        {property.property_url && (
                          <div className="mt-4">
                            <a 
                              href={property.property_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                            >
                              View on Realtor.com
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Raw JSON Response</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96 border border-gray-200 dark:border-gray-700">
                <pre className="text-xs">
                  {JSON.stringify(properties, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md border border-red-200 dark:border-red-900/30">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
