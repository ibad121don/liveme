"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface ActionDropdownProps {
  items: string[];
  onSelect: (action: string) => void;
}

export default function ActionDropdown({
  items,
  onSelect,
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="More actions"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                role="menuitem"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
