import { useState } from "react";
import Search from "./components/search";
import { Label, Field, Select } from "@headlessui/react";

function App() {
  const [algorithm, setAlgorithm] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="flex w-full mb-6">
        <Field className="w-full" onChange={(e) => setAlgorithm(e.target.value)}>
          <Label className="text-sm text-gray-700 mb-1 block">
            Algorithm
          </Label>
          <Select
            name="status"
            aria-label="Algorithm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white  text-gray-900"
          >
            <option value="active">Trie-based</option>
            <option value="paused">HashMap-based</option>
          </Select>
        </Field>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md gap-6">
        <div className="text-6xl font-sans font-medium">
          <span className="text-blue-500">Y</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <Search algorithm={algorithm} />
        <div className="flex gap-2 mt-6">
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 rounded">
            Google Search
          </button>
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 rounded">
            I'm Feeling Lucky
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
