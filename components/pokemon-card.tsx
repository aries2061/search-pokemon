'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { PokemonCardProps } from '@/lib/interfaces/components';

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/?search=${encodeURIComponent(pokemon.name)}`}>
      <Card className="h-full flex flex-col">
        <div className="flex justify-center flex-grow p-4">
          <img 
            src={pokemon.compressedImage || pokemon.image || ''}
            alt={pokemon.name}
            className="object-contain w-[165px] h-[165px]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.svg';
            }}
          />
        </div>
        <CardContent className="text-center mt-auto pt-4 border-t border-gray-100">
          <CardTitle>{pokemon.name}</CardTitle>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {pokemon.types && pokemon.types.map((type: string) => (
              <span
                key={type}
                className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}