import React, { useEffect, useState } from "react";

function Info() {
    const [loading, setLoading] = useState(true);
    const [trieBuildTime, setTrieBuildTime] = useState(0);
    const [hashMapBuildTime, setHashMapBuildTime] = useState(0);

    useEffect(() => {
        fetch(
            `http://localhost:8000/program_data`)
            .then((res) => res.json())
            .then((data) => {
              setTrieBuildTime(data.trie_build_time);
              setHashMapBuildTime(data.hashmap_build_time);
              setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [])
  return (
    <div className="flex flex-row gap-6">
      <div className="pr-2">
        <div className="bg-green-50 p-3 rounded-md h-full">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-sm font-medium text-gray-700">
              Trie Structure
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Optimized for prefix matching
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700">
              Build Time:
            </span>
            {loading ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full animate-pulse">
                Building...
              </span>
            ) : (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {trieBuildTime.toFixed(2)} s
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="pr-2">
        <div className="bg-blue-50 p-3 rounded-md h-full">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <h3 className="text-sm font-medium text-gray-700">
              HashMap Structure
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Optimized for contains matching
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700">
              Build Time:
            </span>
            {loading ? (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full animate-pulse">
                Building...
              </span>
            ) : (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {hashMapBuildTime.toFixed(2)} s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
