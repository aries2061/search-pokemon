'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@apollo/client/react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import PokemonResult from '@/components/pokemon-result';
import Pagination from '@/components/pagination';
import { Pokemon } from '@/lib/types';
import { GET_POKEMONS } from '@/lib/graphql/queries';
import Link from 'next/link';

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const POKEMON_PER_PAGE = 16;
  const [totalPages, setTotalPages] = useState(1);
  const [shouldFetchNames, setShouldFetchNames] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Client-side caching implementation
  useEffect(() => {
    if (searchQuery) {
      // We'll update the localStorage only when we have found Pokemon data
      // This will be handled in the PokemonResult component
    }
  }, [searchQuery]);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On first load, populate localStorage with all Pokémon names if missing
  useEffect(() => {
    if (!isMounted) return;
    try {
      const existing = localStorage.getItem('pokemonNames');
      if (!existing) {
        setShouldFetchNames(true);
      }
    } catch (e) {
      // If localStorage access fails, skip silently
      console.error('Failed to access localStorage:', e);
    }
  }, [isMounted]);

  // Fetch all Pokemon data after component mounts
  const { data: allPokemonsData } = useQuery<{ pokemons: Pokemon[] }>(GET_POKEMONS, {
    variables: { first: 1000 }, // Fetch a large number to get all Pokemon
    skip: !isMounted,
  });

  // Process all Pokemon data
  useEffect(() => {
    if (!allPokemonsData?.pokemons || !isMounted) return;
    
    const pokemonData = allPokemonsData.pokemons;
    setAllPokemons(pokemonData);
    setTotalPokemonCount(pokemonData.length);
    setTotalPages(Math.ceil(pokemonData.length / POKEMON_PER_PAGE));
  }, [allPokemonsData, isMounted]);

  // Fetch Pokémon names only when needed for search suggestions
  const { data: pokemonNamesData } = useQuery<{ pokemons: { name: string }[] }>(GET_POKEMONS, {
    variables: { first: 200 },
    skip: !shouldFetchNames,
  });

  // Persist fetched names to localStorage for search suggestion
  useEffect(() => {
    if (!pokemonNamesData?.pokemons || !isMounted) return;
    try {
      const names = pokemonNamesData.pokemons.map((p) => p.name);
      localStorage.setItem('pokemonNames', JSON.stringify(names));
    } catch (e) {
      // Fail silently to avoid impacting UI
      console.error('Failed to persist Pokémon names to localStorage:', e);
    } finally {
      setShouldFetchNames(false);
    }
  }, [pokemonNamesData, isMounted]);

  // Load recent searches from localStorage - removed as it's not being used
  // This functionality can be re-added later if needed

  const handleSearch = (query: string) => {
    setSearchInputValue(query);
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  const handlePokemonClick = (pokemonName: string) => {
    setSearchInputValue(pokemonName);
    window.location.href = `/?search=${encodeURIComponent(pokemonName)}`;
  };

  // Get current page of Pokemon for display
  const getCurrentPagePokemons = () => {
    const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
    const endIndex = startIndex + POKEMON_PER_PAGE;
    return allPokemons.slice(startIndex, endIndex);
  };

  return (
    <main className="min-h-screen p-2 md:p-8 bg-white sm:bg-transparent">
      <div className="max-w-4xl mx-auto bg-white p-1 rounded-xl sm:p-5 sm:rounded-2xl sm:shadow-sm sm:shadow-amber-200">
        <div className="flex justify-between text-center mb-4">
          <div>
            <Image 
              src="/pokemon-logo.png" 
              alt="Pokemon Logo" 
              width={140} 
              height={80} 
              priority
              style={{ height: 'auto' }}
            />
          </div>
          <div className='justify-end'>
            <SearchInput 
              onSearch={handleSearch} 
              initialValue={searchQuery} 
              placeholder="Search a Pokémon..." 
              value={searchInputValue}
              onChange={setSearchInputValue}
            />
          </div>
        </div>

        {searchQuery ? (
          <div className="mt-8">
            <PokemonResult pokemonName={searchQuery} onPokemonClick={handlePokemonClick} />
          </div>
        ) : (
          <>
            {/* Display all Pokemon section */}
            {allPokemons.length > 0 && (
              <>
                <div className="mt-8">
                  <div className="flex gap-1.5 items-center mb-4 pl-1">
                    <h2 className="text-xl font-semibold">All Pokémon ({totalPokemonCount})</h2>
                  </div>
                  {/* 4x4 grid for desktop, 2 columns for mobile */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getCurrentPagePokemons().map((pokemon, index) => (
                      <div key={pokemon.id || `pokemon-${index}`} className="h-full">
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
                          <div 
                            className="p-4 text-center h-full flex flex-col cursor-pointer"
                            onClick={() => handlePokemonClick(pokemon.name)}
                          >
                            <div className="flex-grow flex items-center justify-center mb-3">
                              <Image
                                src={pokemon.image || '/icon.svg'}
                                alt={pokemon.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="mt-auto">
                              <h3 className="font-semibold text-sm md:text-base mb-1">{pokemon.name}</h3>
                              {pokemon.classification && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                  {pokemon.classification}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
                <p className="text-sm text-gray-600 text-center my-3"> Showing 16 Pokémon per page</p>
              </>
            )}
          </>
        )}
      </div>
        <div className="text-sm text-gray-800 text-end">
          <Link href="https://www.linkedin.com/in/aung-thura-atr/" target="_blank" className='cursor-pointer hover:underline'>
            Developed by Aung Thura
          </Link>
        </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen p-2 md:p-8 bg-white sm:bg-transparent">
      <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl sm:p-7 sm:rounded-2xl sm:shadow-sm sm:shadow-amber-200">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Image 
              src="/pokemon-logo.png" 
              alt="Pokemon Logo" 
              width={250} 
              height={110} 
              priority
            />
          </div>
          <p className="text-gray-500 bold text-md sm:text-lg mb-12">
            Loading...
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
