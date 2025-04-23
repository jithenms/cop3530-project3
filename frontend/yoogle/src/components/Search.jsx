import { Field, Label, Select } from "@headlessui/react";
import React from "react";
import { useState, useEffect } from "react";

function Search(params) {
  const [q, setQ] = useState("");
  const [algorithm, setAlgorithm] = useState("trie");
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    handleSubmit();
  }, [q]);

  const clear = () => {
    setQ("");
    setSuggestions([]);
    setShowResults(false);
    setElapsedTime(null);
  };

  const handleSubmit = () => {
    if (q.trim() === "") {
      setSuggestions([]);
      setShowResults(false);
      setElapsedTime(null);  
      return;
    }

    fetch(
      `http://localhost:8000/suggest?prefix=${encodeURIComponent(
        q
      )}&algorithm=${algorithm}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.results);
        setElapsedTime(data.elapsed_time);
        setShowResults(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-2 py-6 gap-4 px-2 text-xs text-gray-500">
        <div>
          <Field
            className="w-full"
            onChange={(e) =>
              setAlgorithm(e.target.value === "Trie-based" ? "trie" : "hashmap")
            }
          >
            <div className="flex flex-row items-center gap-2">
            <span className="mr-1">Algorithm:</span>
            <Select
                name="status"
                aria-label="Algorithm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white  text-gray-900"
              >
                <option value="active">Trie-based</option>
                <option value="paused">HashMap-based</option>
              </Select>
            </div>
          </Field>
        </div>
        <div className="flex justify-center">
          <span className="mr-1">Processing time:</span>
          {elapsedTime == null ? (
            <span className="text-blue-500 font-medium animate-pulse">
              Awaiting Input...
            </span>
          ) : (
            <span className="font-medium text-green-600">{elapsedTime.toFixed(2)} ms</span>
          )}
        </div>
      </div>
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

export default Search;