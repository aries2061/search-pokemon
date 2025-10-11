'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { PokemonCardProps } from '@/lib/interfaces/components';
import Image from 'next/image';

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/?search=${encodeURIComponent(pokemon.name)}`}>
      <Card className="h-full flex flex-col">
        <div className="flex justify-center flex-grow p-4">
          {
            pokemon.compressedImage? (
                <Image
                  src={pokemon.compressedImage}
                  alt="Compressed Image"
                  width={20}
                  height={20}
                  className="object-contain w-[165px] h-[165px]"
                />
            ) : (
              pokemon.image ? (
                  <Image
                    src={pokemon.image}
                    alt="Original Image"
                    width={20}
                    height={20}
                    className="object-contain w-[165px] h-[165px]"
                  />
              ) : (
                <Image
                  src="/icon.svg"
                  alt="Fallback Icon"
                  width={20}
                  height={20}
                  className="object-contain w-[165px] h-[165px]"
                />
              )
            )
          }
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