'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useEffect, Suspense, useState } from 'react';
import { GET_POKEMON } from '@/lib/graphql/queries';
import { PokemonQueryResponse } from '@/lib/types';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import PokemonNotFound from '@/components/not-found';
import { downloadAndCompressImage, useOnlineStatus } from '@/lib/utils';

import { PokemonResultProps } from '@/lib/interfaces/components';

// Loading component for Suspense fallback
function PokemonLoading() {
  return (
    <div className="text-center p-8 animate-pulse">
      <div className="h-48 w-48 bg-gray-200 rounded-lg mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      <p className="text-gray-500 mt-4">Loading Pokémon data...</p>
    </div>
  );
}

// Pokemon data component that will be wrapped with Suspense
function PokemonData({ pokemon, onEvolutionClick, onBackClick }: any) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 sm:p-6">
        <button 
          onClick={onBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors cursor-pointer"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </button>

        {/* Pokémon Details */}
        <div className="flex flex-col md:flex-row items-center border-1 border-gray-500 sm:border-0 rounded-lg p-3">
          <div className="relative w-48 h-48 mb-4 md:mb-0 md:mr-6">
            {pokemon.image && (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{pokemon.name}</h2>
              <span className="text-gray-500">#{pokemon.number}</span>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">{pokemon.classification}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {pokemon.types.map((type: string) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p>
                  {pokemon.height.minimum} - {pokemon.height.maximum}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p>
                  {pokemon.weight.minimum} - {pokemon.weight.maximum}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max HP</p>
                <p>{pokemon.maxHP}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max CP</p>
                <p>{pokemon.maxCP}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Breakline */}
        <div className="flex justify-center my-4 sm:my-5">
          <hr className="w-[100%] sm:w-[75%] border-gray-300" />
        </div>
        
        {/* Pokémon Details - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Attacks */}
          {pokemon.attacks && (
            <div className="col-span-1 flex flex-col items-center border-1 border-gray-300 rounded-lg p-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Image src="/game-icon/sword.svg" width={24} height={24} alt="Sword icon" className="mr-1" /> 
                <span>Attacks</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* Fast Attacks */}
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium mb-1">Fast</h4>
                  <div className="space-y-1 w-full">
                    {pokemon.attacks.fast.map((attack: any) => (
                      <div
                        key={attack.name}
                        className="flex justify-between items-center p-1 bg-gray-50 rounded text-xs"
                      >
                        <div className="truncate mr-1">
                          <span className="font-medium">{attack.name}</span>
                          <span className="ml-1 text-xs text-gray-500">
                            {attack.type}
                          </span>
                        </div>
                        <span className="bg-red-600 text-white font-bold px-1 py-0.5 rounded-md text-xs whitespace-nowrap">{attack.damage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Special Attacks */}
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium mb-1">Special</h4>
                  <div className="space-y-1 w-full">
                    {pokemon.attacks.special.map((attack: any) => (
                      <div
                        key={attack.name}
                        className="flex justify-between items-center p-1 bg-gray-50 rounded text-xs"
                      >
                        <div className="truncate mr-1">
                          <span className="font-medium">{attack.name}</span>
                          <span className="ml-1 text-xs text-gray-500">
                            {attack.type}
                          </span>
                        </div>
                        <span className="bg-red-600 text-white font-bold px-1 py-0.5 rounded-md text-xs whitespace-nowrap">{attack.damage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Column 2: Resistances */}
          {pokemon.resistant && (
            <div className="col-span-1 flex flex-col items-center border-1 border-gray-300 rounded-lg p-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Image src="/game-icon/shield.svg" width={24} height={24} alt="Shield icon" className="mr-1" /> 
                <span>Resistances</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 w-full">
                {pokemon.resistant.map((type: string) => (
                  <div
                    key={type}
                    className="flex justify-center items-center p-1 bg-green-50 rounded text-xs"
                  >
                    <span className="font-medium text-green-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Column 3: Weaknesses */}
          {pokemon.weaknesses && (
            <div className="col-span-1 flex flex-col items-center border-1 border-gray-300 rounded-lg p-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Image src="/game-icon/weak.svg" width={24} height={24} alt="Weakness icon" className="mr-1" /> 
                <span>Weaknesses</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 w-full">
                {pokemon.weaknesses.map((type: string) => (
                  <div
                    key={type}
                    className="flex justify-center items-center p-1 bg-red-50 rounded text-xs"
                  >
                    <span className="font-medium text-red-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution Requirements Section */}
        {pokemon.evolutionRequirements && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Evolution Requirements</h3>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Requires:</span> {pokemon.evolutionRequirements.amount} {pokemon.evolutionRequirements.name}
              </p>
            </div>
          </div>
        )}

        {/* Evolutions Section */}
        {pokemon.evolutions && pokemon.evolutions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Evolutions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pokemon.evolutions.map((evolution: any) => (
                <div
                  key={evolution.id}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onEvolutionClick(evolution.name)}
                >
                  <div className="relative w-20 h-20 mb-2">
                    {evolution.image && (
                      <Image
                        src={evolution.image}
                        alt={evolution.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium">{evolution.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PokemonResult({ pokemonName }: PokemonResultProps) {
  const router = useRouter();
  const { isOnline } = useOnlineStatus();
  const [localPokemon, setLocalPokemon] = useState<any>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Only run GraphQL query if online
  const { loading: graphqlLoading, error: graphqlError, data } = useQuery<PokemonQueryResponse>(GET_POKEMON, {
    variables: { name: pokemonName },
    skip: !pokemonName || !isOnline,
  });

  // Combined loading state - show loading if either local or GraphQL is loading
  const loading = isLocalLoading || (isOnline && graphqlLoading);
  // Combined error state
  const error = isOnline ? graphqlError : (!localPokemon && !isLocalLoading);

  const handleEvolutionClick = (name: string) => {
    router.replace(`/?search=${encodeURIComponent(name)}`);
  };
  
  // Check localStorage first for the Pokemon data
  useEffect(() => {
    if (!pokemonName) {
      setIsLocalLoading(false);
      return;
    }
    
    setIsLocalLoading(true);
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const foundPokemon = recentSearches.find((p: any) => 
      p.name.toLowerCase() === pokemonName.toLowerCase()
    );
    
    if (foundPokemon) {
      setLocalPokemon(foundPokemon);
    }
    
    setIsLocalLoading(false);
  }, [pokemonName]);
  
  // Store found Pokemon data in localStorage - moved before conditional returns
  useEffect(() => {
    if (data?.pokemon) {
      const pokemon = data.pokemon;
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      
      // Download and compress the image
      const downloadImage = async () => {
        if (pokemon.image) {
          try {
            // Download and compress the image to 40% of original size
            const compressedImageData = await downloadAndCompressImage(pokemon.image, pokemon.name);
            
            // Store full Pokémon data including downloaded image data
            const pokemonToStore = {
              ...pokemon,
              compressedImage: compressedImageData
            };
            
            // Check if this Pokemon is already in recent searches
            const existingIndex = recentSearches.findIndex((p: any) => p.id === pokemon.id);
            
            if (existingIndex !== -1) {
              // Remove the existing entry
              recentSearches.splice(existingIndex, 1);
            }
            
            // Add to the beginning of the array
            recentSearches.unshift(pokemonToStore);
            
            // Keep only the last 10 searches
            if (recentSearches.length > 10) {
              recentSearches.pop();
            }
            
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
          } catch (error) {
            console.error("Error storing compressed image:", error);
            
            // Fallback to storing full data without compressed image
            const pokemonToStore = { ...pokemon };
            
            const existingIndex = recentSearches.findIndex((p: any) => p.id === pokemon.id);
            if (existingIndex !== -1) {
              recentSearches.splice(existingIndex, 1);
            }
            recentSearches.unshift(pokemonToStore);
            if (recentSearches.length > 10) {
              recentSearches.pop();
            }
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
          }
        }
      };
      
      downloadImage();
    }
  }, [data]);

  if (!pokemonName) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Enter a Pokémon name to search</p>
      </div>
    );
  }

  // Use Suspense for loading state
  if (loading) {
    return (
      <Suspense fallback={<PokemonLoading />}>
        <PokemonLoading />
      </Suspense>
    );
  }

  // If we're offline and have local data, use that
  if (!isOnline && localPokemon) {
    const handleBackClick = () => {
      router.replace('/');
    };
    
    return (
      <Suspense fallback={<PokemonLoading />}>
        <PokemonData 
          pokemon={localPokemon} 
          onEvolutionClick={handleEvolutionClick}
          onBackClick={handleBackClick}
        />
      </Suspense>
    );
  }
  
  // If we're offline and don't have local data, or if we're online but got an error
  // Only show PokemonNotFound if we're not in a loading state and there's no data
  if (!loading && (error || (!isOnline && !localPokemon) || (isOnline && !data?.pokemon))) {
    return (
      <PokemonNotFound />
    );
  }

  // If we're online and have data from GraphQL
  const pokemon = isOnline ? data?.pokemon : localPokemon;
  
  const handleBackClick = () => {
    router.replace('/');
  };

  // Render the Pokemon data with Suspense
  return (
    <Suspense fallback={<PokemonLoading />}>
      <PokemonData 
        pokemon={pokemon} 
        onEvolutionClick={handleEvolutionClick}
        onBackClick={handleBackClick}
      />
    </Suspense>
  );
}