'use client';

import React, { useState, useEffect, FormEvent, useRef, useCallback } from 'react';
import { SearchInputProps } from '../../lib/interfaces/ui';
import { getSuggestions } from '../../lib/pokemonSearchUtils';

export const SearchInput = React.memo(function SearchInput({
  onSearch,
  initialValue = '',
  placeholder = 'Search...',
  className = '',
  value,
  onChange,
}: SearchInputProps) {
  const [query, setQuery] = useState(value !== undefined ? value : initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update internal query when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    // Update suggestions when query changes
    if (query.trim()) {
      const matchingSuggestions = getSuggestions(query);
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Use useCallback for stable function references
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      suggestionsRef.current && 
      !suggestionsRef.current.contains(event.target as Node) &&
      inputRef.current && 
      !inputRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    // Handle clicks outside the suggestions dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Use useCallback for event handlers
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  }, [query, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setShowSuggestions(true);
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
    onSearch(suggestion);
    setShowSuggestions(false);
  }, [onChange, onSearch]);

  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    if (onChange) {
      onChange('');
    }
  }, [onChange]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border-3 border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          aria-label="Search"
          autoComplete="off"
        />
        {
          query.trim() && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="absolute right-10 bottom-1.25 p-2 hover:text-blue-600 transition-all cursor-pointer"
              aria-label="Submit search"
            >
              <span className='text-xs bg-gray-400 rounded p-1 text-white'>Clear</span>
            </button>
          )
        }
        <button 
          type="submit" 
          className="absolute right-2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
          aria-label="Submit search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});