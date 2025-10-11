'use client';

import React from 'react';
import PokemonCard from './pokemon-card';
import { PokemonGridProps } from '@/lib/interfaces/components';

export default function PokemonGrid({ pokemons }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {pokemons.map((pokemon, index) => (
        <div key={pokemon.id || `pokemon-${index}`} className="h-full">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
}