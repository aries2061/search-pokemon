'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentQuery = searchParams.get('search');
    if (currentQuery) {
      setSearchQuery(currentQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use replace instead of push to avoid navigation issues
      router.replace(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    router.replace('/');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pokémon by name..."
          className="w-full px-4 py-2 bg-white border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-[50px] p-1 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 pr-1 py-1 cursor-pointer focus:outline-none"
        >
          <Image
            src="/icon.svg"
            alt="Pokeball Icon"
            width={30}
            height={30}
          />
        </button>
      </div>
    </form>
  );
}