"use client";

import { useState } from "react";
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

      const data = await response.json();
      setProperties(data);
      setStep("results");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
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

  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">HomeHarvest Property Search</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Search for real estate properties using natural language
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
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
                className="p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 px-5 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Search"}
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
                    className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    required
                  />
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-12 px-5"
                >
                  Start Over
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 px-5 disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Find Properties"}
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
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
              >
                New Search
              </button>
            </div>
            
            {properties.length === 0 ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                No properties found matching your criteria.
              </p>
            ) : (
              <div className="grid gap-6">
                {properties.map((property, index) => (
                  <div key={index} className="border rounded-lg p-4 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-2">
                      {property.address || "Property"} {property.city && `- ${property.city}`}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-medium">${property.list_price?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Beds</p>
                        <p className="font-medium">{property.beds || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Baths</p>
                        <p className="font-medium">{property.full_baths || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</p>
                        <p className="font-medium">{property.sqft?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Year Built</p>
                        <p className="font-medium">{property.year_built || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                        <p className="font-medium">{property.property_type || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                      <p className="text-sm mt-1">{property.description?.substring(0, 200) || "No description available"}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Raw JSON Response</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(properties, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
