'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { PokemonCardProps } from '@/lib/interfaces/components';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(pokemon.name);
    }
  };

  return (
    <Link href={`/?search=${encodeURIComponent(pokemon.name)}`} onClick={handleClick}>
      <Card className="h-full flex flex-col">
        <div className="flex justify-center flex-grow p-4">
          <ImageWithFallback
            src={pokemon.compressedImage || pokemon.image || '/icon.svg'}
            alt={pokemon.name}
            width={20}
            height={20}
            className="object-contain w-[165px] h-[165px]"
            priority={true}
            loading="eager"
          />
        </div>
        <CardContent className="text-center mt-auto pt-4 border-t border-gray-100">
          <CardTitle>{pokemon.name}</CardTitle>
          {pokemon.classification && (
            <div className="mt-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                {pokemon.classification}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}