"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
};

export default function LocationPicker() {
  const [userInput, setUserInput] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<PlacePrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions when user input changes (skip when a location is selected)
  useEffect(() => {
    if (selectedLocation) return;
    if (userInput.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    fetch(`/api/places?input=${encodeURIComponent(userInput)}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.predictions ?? []);
        setShowDropdown(true);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userInput, selectedLocation]);

  const handleSelect = (prediction: PlacePrediction) => {
    setUserInput(prediction.description);
    setSelectedLocation(prediction);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setUserInput("");
    setSelectedLocation(null);
    setSuggestions([]);
    setShowDropdown(false);
    requestAnimationFrame(() => inputRef.current?.focus()); //schedules focusing the input on the next paint after batching prev steps
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="relative max-w-xs">
      <InputGroup>
        <InputGroupInput
          ref={inputRef}
          id="userInput"
          type="text"
          placeholder="Search Location..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onBlur={handleBlur}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {selectedLocation ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Clear location"
            >
              <X className="size-4" />
            </button>
          ) : loading ? (
            "..."
          ) : suggestions.length > 0 ? (
            `${suggestions.length} results`
          ) : null}
        </InputGroupAddon>
      </InputGroup>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {suggestions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(prediction);
              }}
            >
              <span className="font-medium">{prediction.structured_formatting?.main_text ?? prediction.description}</span>
              {prediction.structured_formatting?.secondary_text && (
                <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                  {prediction.structured_formatting.secondary_text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
