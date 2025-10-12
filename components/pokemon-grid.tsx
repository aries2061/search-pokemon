'use client';

import React from 'react';
import PokemonCard from './pokemon-card';
import { PokemonGridProps } from '@/lib/interfaces/components';

interface PokemonGridPropsWithClick extends PokemonGridProps {
  onPokemonClick?: (pokemonName: string) => void;
}

export default function PokemonGrid({ pokemons, onPokemonClick }: PokemonGridPropsWithClick) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pokemons.map((pokemon, index) => (
        <PokemonCard 
          key={pokemon.id || `pokemon-${index}`} 
          pokemon={pokemon} 
          onClick={onPokemonClick}
        />
      ))}
    </div>
  );
}