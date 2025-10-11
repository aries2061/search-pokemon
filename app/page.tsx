'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import PokemonResult from '@/components/pokemon-result';
import PokemonGrid from '@/components/pokemon-grid';
import PokemonNotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import { Pokemon } from '@/lib/types';
import { GET_POKEMONS } from '@/lib/graphql/queries';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [recentSearchPokemons, setRecentSearchPokemons] = useState<Pokemon[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldFetchNames, setShouldFetchNames] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Mock data for the grid since the API might be having issues
  const mockPokemons = [
    {
      id: "UG9rZW1vbjowMDE=",
      number: "001",
      name: "Bulbasaur",
      types: ["Grass", "Poison"],
      image: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
      evolutions: [{ id: "UG9rZW1vbjowMDI=", name: "Ivysaur" }]
    },
    {
      id: "UG9rZW1vbjowMDQ=",
      number: "004",
      name: "Charmander",
      types: ["Fire"],
      image: "https://img.pokemondb.net/artwork/charmander.jpg",
      evolutions: [{ id: "UG9rZW1vbjowMDU=", name: "Charmeleon" }]
    },
    {
      id: "UG9rZW1vbjowMDc=",
      number: "007",
      name: "Squirtle",
      types: ["Water"],
      image: "https://img.pokemondb.net/artwork/squirtle.jpg",
      evolutions: [{ id: "UG9rZW1vbjowMDg=", name: "Wartortle" }]
    },
    {
      id: "UG9rZW1vbjowMjU=",
      number: "025",
      name: "Pikachu",
      types: ["Electric"],
      image: "https://img.pokemondb.net/artwork/pikachu.jpg",
      evolutions: [{ id: "UG9rZW1vbjowMjY=", name: "Raichu" }]
    },
    {
      id: "UG9rZW1vbjowMzM=",
      number: "033",
      name: "Nidorino",
      types: ["Poison"],
      image: "https://img.pokemondb.net/artwork/nidorino.jpg",
      evolutions: [{ id: "UG9rZW1vbjowMzQ=", name: "Nidoking" }]
    },
    {
      id: "UG9rZW1vbjowMzk=",
      number: "039",
      name: "Jigglypuff",
      types: ["Normal", "Fairy"],
      image: "https://img.pokemondb.net/artwork/jigglypuff.jpg",
      evolutions: [{ id: "UG9rZW1vbjowNDA=", name: "Wigglytuff" }]
    }
  ];

  // Client-side caching implementation
  useEffect(() => {
    if (searchQuery) {
      // We'll update the localStorage only when we have found Pokemon data
      // This will be handled in the PokemonResult component
    }
  }, [searchQuery]);

  // On first load, populate localStorage with all Pokémon names if missing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem('pokemonNames');
      if (!existing) {
        setShouldFetchNames(true);
      }
    } catch (e) {
      // If localStorage access fails, skip silently
    }
  }, []);

  // Fetch Pokémon names only when needed
  const { data: allPokemonsData } = useQuery<{ pokemons: { name: string }[] }>(GET_POKEMONS, {
    variables: { first: 200 },
  });

  // Persist fetched names to localStorage
  useEffect(() => {
    if (!allPokemonsData?.pokemons || typeof window === 'undefined') return;
    try {
      const names = allPokemonsData.pokemons.map((p) => p.name);
      localStorage.setItem('pokemonNames', JSON.stringify(names));
    } catch (e) {
      // Fail silently to avoid impacting UI
    } finally {
      setShouldFetchNames(false);
    }
  }, [allPokemonsData]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !searchQuery) {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      
      // The recentSearches now contains complete Pokemon objects, no need to transform
      const recentPokemonData = recentSearches;
      
      setTotalItems(recentPokemonData.length);
      setTotalPages(Math.ceil(recentPokemonData.length / ITEMS_PER_PAGE));
      
      // Get current page of pokemon
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setRecentSearchPokemons(recentPokemonData.slice(startIndex, endIndex));
    }
  }, [currentPage, searchQuery]);

  const handleSearch = (query: string) => {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  return (
    <main className="min-h-screen p-2 md:p-8 bg-white sm:bg-transparent">
      <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl sm:p-7 sm:rounded-2xl sm:shadow-sm sm:shadow-amber-200">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Image 
              src="/pokemon-logo.png" 
              alt="Pokemon Logo" 
              width={300} 
              height={110} 
              priority
            />
          </div>
          <p className="text-gray-500 bold text-md sm:text-xl mb-12">
            Search for any Pokémon to view detailed information
          </p>
          <SearchInput onSearch={handleSearch} initialValue={searchQuery} placeholder="Search for a Pokémon..." />
        </div>

        {searchQuery ? (
          <div className="mt-8">
            <PokemonResult pokemonName={searchQuery} />
          </div>
        ) : (
          <>
            {recentSearchPokemons.length > 0 ? (
              <>
                <div className="mt-8">
                  <div className="flex gap-1.5 items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Recent Searches</h2>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('recentSearches');
                        setRecentSearchPokemons([]);
                        setTotalItems(0);
                        setTotalPages(1);
                      }}
                      className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
                    >
                      <Image
                        src="/game-icon/bin.svg"
                        alt="Clear Recent Icon"
                        width={30}
                        height={30}
                      />
                    </button>
                  </div>
                  <PokemonGrid pokemons={recentSearchPokemons as Pokemon[]} />
                </div>
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            ) : null}
          </>
        )}
        <div className="fixed bottom-5 right-5 text-sm text-gray-600">
          Developed by Aung Thura
        </div>
      </div>
    </main>
  );
}
