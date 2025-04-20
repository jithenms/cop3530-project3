import React from "react";
import { useState, useEffect } from "react";
import { Select } from "@headlessui/react";

export default function Search(algorithm) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [q]);

  const clear = () => {
    setQ("");
    setSuggestions([]);
    setShowResults(false);
  };

  const handleSubmit = () => {
    if (q.trim() === "") {
      setSuggestions([]);
      return;
    }

    fetch(`http://localhost:8000/suggest?prefix=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(algorithm == "Trie-based" ? data.trie : data.map);
        setShowResults(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 h-4 w-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search Yoogle or type a URL"
            className="pl-9 pr-10 py-3 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          {q && (
            <button
              type="button"
              className="absolute right-3 h-5 w-5 rounded-full text-gray-400 hover:text-gray-600"
              onClick={clear}
            >
              <span className="sr-only">Clear search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete suggestions */}
      {showResults && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  onClick={() => setQ(suggestion)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
