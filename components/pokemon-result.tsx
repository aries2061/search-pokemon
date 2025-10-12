'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { GET_POKEMON } from '@/lib/graphql/queries';
import { PokemonQueryResponse } from '@/lib/types';
import PokemonNotFound from '@/components/not-found';
import { downloadAndCompressImage, useOnlineStatus } from '@/lib/utils';

import { PokemonResultProps } from '@/lib/interfaces/components';
import { Pokemon } from '@/lib/types';

// Lazy load the PokemonDetails component for code splitting
const PokemonDetails = lazy(() => import('@/components/ui/PokemonDetails').then(module => ({ default: module.PokemonDetails })));

// Import the skeleton component
import { PokemonDetailsSkeleton } from '@/components/ui/PokemonDetailsSkeleton';

export default function PokemonResult({ pokemonName, onPokemonClick, onBackClick }: PokemonResultProps) {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const [localPokemon, setLocalPokemon] = useState<Pokemon | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
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
    if (onPokemonClick) {
      onPokemonClick(name);
    } else {
      router.replace(`/?search=${encodeURIComponent(name)}`);
    }
  };
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check localStorage first for the Pokemon data
  useEffect(() => {
    if (!pokemonName || !isMounted) {
      setIsLocalLoading(false);
      return;
    }
    
    setIsLocalLoading(true);
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const foundPokemon = recentSearches.find((p: Pokemon) => 
      p.name.toLowerCase() === pokemonName.toLowerCase()
    );
    
    if (foundPokemon) {
      setLocalPokemon(foundPokemon);
    }
    
    setIsLocalLoading(false);
  }, [pokemonName, isMounted]);
  
  // Store found Pokemon data in localStorage - moved before conditional returns
  useEffect(() => {
    if (!data?.pokemon || !isMounted) return;
    
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
            const existingIndex = recentSearches.findIndex((p: Pokemon) => p.id === pokemon.id);
            
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
            
            const existingIndex = recentSearches.findIndex((p: Pokemon) => p.id === pokemon.id);
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
  }, [data, isMounted]);

  if (!pokemonName) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Enter a Pokémon name to search</p>
      </div>
    );
  }

  // Use Suspense for loading state
  if (loading) {
    return <PokemonDetailsSkeleton />;
  }

  // If we're offline and have local data, use that
  if (!isOnline && localPokemon) {
    const handleBackClick = () => {
      if (onBackClick) {
        onBackClick();
      } else {
        router.replace('/');
      }
    };
    
    return (
      <Suspense fallback={<PokemonDetailsSkeleton />}>
        <PokemonDetails 
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
    if (onBackClick) {
      onBackClick();
    } else {
      router.replace('/');
    }
  };

  // Render the Pokemon data with Suspense
  return (
    <Suspense fallback={<PokemonDetailsSkeleton />}>
      {pokemon && (
        <PokemonDetails 
          pokemon={pokemon} 
          onEvolutionClick={handleEvolutionClick}
          onBackClick={handleBackClick}
        />
      )}
    </Suspense>
  );
}