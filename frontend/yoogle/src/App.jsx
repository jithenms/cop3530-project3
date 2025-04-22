import { useState } from "react";
import { Label, Field, Select } from "@headlessui/react";
import Search from "./components/Search";
import Info from "./components/Info";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <Info />
        <div>
          <div className="flex justify-center text-6xl font-sans font-medium">
            <span className="text-blue-500">Y</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
          <Search />
          <div className="flex justify-center gap-2 mt-6">
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 rounded">
              Yoogle Search
            </button>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 rounded">
              I'm Feeling Lucky
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
