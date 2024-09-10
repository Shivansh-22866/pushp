"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CollectionType {
  _id: string;
  title: string;
}

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections = [],
  value = [],
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter collections based on inputValue
  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(collection._id)
  );

  // Handle selection of an item
  const handleSelect = (id: string) => {
    onChange(id);
    setInputValue("");
    setIsOpen(false);
  };

  // Open dropdown on input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Open dropdown on input click
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle input value change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true); // Ensure dropdown remains open when typing
  };

  // Handle blur event to keep dropdown open if clicking inside it
  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap items-center border border-gray-300 rounded-lg bg-white shadow-sm">
        {value.map((id) => {
          const collection = collections.find((col) => col._id === id);
          return collection ? (
            <Badge key={id} className="flex items-center mb-1 mr-1 bg-gray-200 text-gray-800 m-2">
              {collection.title}
              <button
                type="button"
                className="ml-1 text-red-600 hover:text-red-800"
                onClick={() => onRemove(id)}
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ) : null;
        })}
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onClick={handleClick}
          onBlur={handleBlur}
          ref={inputRef}
          className="flex-1 px-3 py-2 border-none outline-none placeholder-gray-400 rounded-lg"
        />
      </div>

      {isOpen && filteredCollections.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="max-h-60 overflow-auto p-1">
            {filteredCollections.map((collection) => (
              <li
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(collection._id)}
                className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 ease-in-out"
              >
                {collection.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
