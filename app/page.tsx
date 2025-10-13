'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client/react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import Pagination from '@/components/pagination';
import SkeletonGrid from '@/components/ui/SkeletonGrid';
import { Pokemon } from '@/lib/types';
import { GET_POKEMONS } from '@/lib/graphql/queries';
import Link from 'next/link';

// Lazy load the PokemonResult component for code splitting
const PokemonResult = lazy(() => import('@/components/pokemon-result'));

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const POKEMON_PER_PAGE = 16;
  const [totalPages, setTotalPages] = useState(1);
  const [shouldFetchNames, setShouldFetchNames] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  
  // Navigation history state - stack of Pokemon names with localStorage persistence
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Load navigation history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('pokemon-navigation-history');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setNavigationHistory(parsedHistory);
        } catch (error) {
          console.error('Error parsing navigation history from localStorage:', error);
        }
      }
    }
  }, []);

  // Save navigation history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && navigationHistory.length > 0) {
      localStorage.setItem('pokemon-navigation-history', JSON.stringify(navigationHistory));
    }
  }, [navigationHistory]);

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

  // Clear navigation history only when manually navigating to home page (no search query)
  useEffect(() => {
    if (!searchQuery && isMounted && navigationHistory.length > 0) {
      // Only clear if we're actually on the home page and have history
      // This prevents clearing during back navigation
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl === '/' || currentUrl === '') {
        // Check if this is a manual navigation to home (not from back button)
        // We can detect this by checking if the last item in history matches current search
        const lastHistoryItem = navigationHistory[navigationHistory.length - 1];
        if (!lastHistoryItem || lastHistoryItem.toLowerCase() !== (searchInputValue || '').toLowerCase()) {
          setNavigationHistory([]);
          // Also clear from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('pokemon-navigation-history');
          }
        }
      }
    }
  }, [searchQuery, isMounted, navigationHistory, searchInputValue]);

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
    // Add to navigation history when searching for a Pokemon
    if (query.trim()) {
      setNavigationHistory(prev => {
        const newHistory = [...prev, query.toLowerCase()];
        // Also update localStorage immediately
        if (typeof window !== 'undefined') {
          localStorage.setItem('pokemon-navigation-history', JSON.stringify(newHistory));
        }
        return newHistory;
      });
    }
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handlePokemonClick = (pokemonName: string) => {
    //console.log('Pokemon clicked:', pokemonName, 'Current history:', navigationHistory);
    setSearchInputValue(pokemonName);
    // Add to navigation history when clicking a Pokemon
    setNavigationHistory(prev => {
      const newHistory = [...prev, pokemonName.toLowerCase()];
      //console.log('Updated history after click:', newHistory);
      // Also update localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokemon-navigation-history', JSON.stringify(newHistory));
      }
      return newHistory;
    });
    router.push(`/?search=${encodeURIComponent(pokemonName)}`);
  };

  // Handler for back button - pops from navigation history
  const handleBackClick = () => {
    //console.log('Back button clicked, current history:', navigationHistory);
    //console.log('History length:', navigationHistory.length);
    
    // Get the current history from localStorage as a fallback
    let currentHistory = [...navigationHistory];
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('pokemon-navigation-history');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (parsedHistory.length >= currentHistory.length) {
            currentHistory = parsedHistory;
            //console.log('Using localStorage history:', currentHistory);
          }
        } catch (error) {
          console.error('Error parsing navigation history from localStorage:', error);
        }
      }
    }
    
    if (currentHistory.length > 1) {
      // Remove current Pokemon from history
      const newHistory = [...currentHistory];
      newHistory.pop();
      
      // Update both state and localStorage immediately
      setNavigationHistory(newHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokemon-navigation-history', JSON.stringify(newHistory));
      }
      
      // Get the previous Pokemon name
      const previousPokemon = newHistory[newHistory.length - 1];
      //console.log('Navigating back to:', previousPokemon);
      //console.log('New history after back:', newHistory);
      setSearchInputValue(previousPokemon);
      router.push(`/?search=${encodeURIComponent(previousPokemon)}`);
    } else {
      //console.log('No history available, going to home page');
      // If no history, go to home page
      setNavigationHistory([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pokemon-navigation-history');
      }
      setSearchInputValue('');
      router.push('/');
    }
  };

  // Handler for Pokemon logo click - clears navigation history
  const handleLogoClick = () => {
    setNavigationHistory([]);
    setSearchInputValue('');
  };

  // Handler for evolution clicks - also adds to navigation history
  const handleEvolutionClick = (pokemonName: string) => {
    //console.log('Evolution clicked:', pokemonName, 'Current history:', navigationHistory);
    setSearchInputValue(pokemonName);
    // Add to navigation history when clicking an evolution
    setNavigationHistory(prev => {
      const newHistory = [...prev, pokemonName.toLowerCase()];
      //console.log('Updated history after evolution click:', newHistory);
      // Also update localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokemon-navigation-history', JSON.stringify(newHistory));
      }
      return newHistory;
    });
    router.push(`/?search=${encodeURIComponent(pokemonName)}`);
  };

  // Get current page of Pokemon for display
  const getCurrentPagePokemons = () => {
    const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
    const endIndex = startIndex + POKEMON_PER_PAGE;
    return allPokemons.slice(startIndex, endIndex);
  };

  return (
    <main className="min-h-screen p-0 sm:p-2 md:p-8 bg-white sm:bg-transparent">
      <div className="w-full sm:max-w-4xl mx-auto bg-white p-1 rounded-xl sm:p-5 sm:rounded-2xl sm:shadow-sm sm:shadow-amber-200">
        {/* Mobile layout: Logo centered, SearchInput below */}
        <div className="flex flex-col items-center text-center mb-4 sm:hidden">
          <div className="mb-4">
            <Link href="/" onClick={handleLogoClick}>
              <Image 
                src="/pokemon-logo.png" 
                alt="Pokemon Logo" 
                width={160} 
                height={100} 
                priority
                fetchPriority="high"
                style={{ height: 'auto', cursor: 'pointer' }}
              />
            </Link>
          </div>
          <div className="w-full max-w-sm">
            <SearchInput 
              onSearch={handleSearch} 
              initialValue={searchQuery} 
              placeholder="Search a Pokémon..." 
              value={searchInputValue}
              onChange={setSearchInputValue}
            />
          </div>
        </div>

        {/* Desktop layout: Logo left, SearchInput right */}
        <div className="hidden sm:flex justify-between text-center mb-4">
          <div>
            <Link href="/" onClick={handleLogoClick}>
              <Image 
                src="/pokemon-logo.png" 
                alt="Pokemon Logo" 
                width={140} 
                height={80} 
                priority
                fetchPriority="high"
                style={{ height: 'auto', cursor: 'pointer' }}
              />
            </Link>
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
            <Suspense fallback={<div className="text-center p-8"><p className="text-gray-500">Loading search results...</p></div>}>
              <PokemonResult pokemonName={searchQuery} onPokemonClick={handleEvolutionClick} onBackClick={handleBackClick} />
            </Suspense>
          </div>
        ) : (
          <>
            {/* Display all Pokemon section */}
            {allPokemons.length > 0 ? (
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
                                width={96}
                                height={96}
                                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                                loading={index < 8 ? "eager" : "lazy"}
                                priority={index < 4}
                                fetchPriority={index < 4 ? "high" : "auto"}
                                sizes="(max-width: 768px) 80px, 96px"
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
            ) : (
              <div className="mt-8">
                <div className="flex gap-1.5 items-center mb-4 pl-1">
                  <h2 className="text-xl font-semibold">Loading Pokémon...</h2>
                </div>
                <SkeletonGrid count={16} />
              </div>
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
  // Handler for Pokemon logo click in loading fallback - clears navigation history
  const handleLogoClick = () => {
    // Since this is in LoadingFallback, we can't access the state directly
    // The navigation will clear the history when going to home page
  };

  return (
    <main className="min-h-screen p-2 md:p-8 bg-white sm:bg-transparent">
      <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl sm:p-7 sm:rounded-2xl sm:shadow-sm sm:shadow-amber-200">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Link href="/" onClick={handleLogoClick}>
              <Image 
                src="/pokemon-logo.png" 
                alt="Pokemon Logo" 
                width={250} 
                height={110} 
                priority
                style={{ cursor: 'pointer' }}
              />
            </Link>
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
