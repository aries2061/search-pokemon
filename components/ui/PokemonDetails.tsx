'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PokemonDataProps } from '@/lib/interfaces/ui';
import { Pokemon, Attack } from '@/lib/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export function PokemonDetails({ pokemon, onEvolutionClick, onBackClick }: PokemonDataProps) {
  const backgroundColor = 'rgba(200, 200, 200, 0.1)';
  return (
    <div className="rounded-lg shadow-lg overflow-hidden" style={{ 'backgroundColor': backgroundColor }}>
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
        <div className="flex flex-col md:flex-row gap-4 rounded-lg">
          {/* First Column: Pokemon Image + Evolution Requirements + Evolutions */}
          <div className="w-full md:w-1/2 bg-white rounded-lg flex flex-col min-h-[500px]">
            {/* Pokemon Image Section */}
            <div className="flex-[2] flex flex-col items-center justify-center p-4">
              <div 
                className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center mb-4"
                style={{ aspectRatio: '1/1' }}
              >
                <ImageWithFallback
                  src={pokemon.image || '/icon.svg'}
                  alt={pokemon.name}
                  width={224}
                  height={224}
                  className="object-contain w-full h-full"
                  priority={true}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 160px, 224px"
                />
              </div>
              
              {/* Evolution Requirements Section */}
              {pokemon.evolutionRequirements && (
                <div className="w-full max-w-sm">
                  <h3 className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <ImageWithFallback src="/game-icon/evolution.svg" width={16} height={16} alt="Evolution requirement icon" className="mr-2" priority={false} loading="lazy" />
                    <span>Evolution Requirement</span>
                  </h3>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-amber-600 font-medium">
                      {pokemon.evolutionRequirements.name}: {pokemon.evolutionRequirements.amount}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Second Row: Evolutions - 25% height */}
            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
              <div className="flex-1 p-4 border-t border-gray-200">
                <h3 className="flex items-center text-lg font-bold text-gray-800 mb-3">
                  <ImageWithFallback src="/game-icon/evolution.svg" width={20} height={20} alt="Evolution icon" className="mr-2" priority={false} loading="lazy" />
                  <span>Evolutions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-colors">
                  {pokemon.evolutions.map((evolution: Pokemon) => (
                    <div key={evolution.id} className="flex flex-col items-center p-2 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-amber-300 hover:-translate-y-1 transition-transform duration-200 ease-in-out flex-shrink-0" onClick={() => onEvolutionClick(evolution.name)}>
                      <div className="w-12 h-12 mb-2 relative" style={{ aspectRatio: '1/1' }}>
                        <ImageWithFallback
                          src={evolution.image || '/icon.svg'}
                          alt={evolution.name}
                          className="w-full h-full object-contain rounded-lg"
                          width={48}
                          height={48}
                          priority={false}
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center flex-shrink-0">
                        {evolution.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Second Column: Pokemon Info with dark background - Equal width on desktop */}
          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-4 text-white flex flex-col gap-4">
            {/* Row 1: Pokemon Name and Number */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="flex items-center justify-center text-2xl md:text-3xl font-bold text-white">
                <span>{pokemon.name}</span> 
                <span className="border border-white rounded-md text-white text-xs ml-2 p-1 font-normal"> {pokemon.classification} </span>
              </h2>
              <span className="text-gray-300 text-lg">#{pokemon.number}</span>
            </div>

            {/* Row 2: Types and Abilities */}
            <div className='mb-2'>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type: string) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-amber-600 text-white font-bold rounded-full text-sm flex items-center gap-1"
                  >
                    <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Combined Stats and Attack Information Section */}
            <div className="bg-white rounded-md p-3 flex-1">
              {/* Stats Section */}
              <h3 className="text-md font-semibold text-gray-800 mb-2">Stats</h3>
              <div className="grid grid-cols-2 gap-2 h-auto mb-4">
                {/* First Row */}
                <div className="text-center flex flex-col justify-center min-h-[40px]">
                  <div className="text-sm font-bold text-gray-800">Height</div>
                  <div className="text-xs text-gray-800">{pokemon.height.minimum}-{pokemon.height.maximum}</div>
                </div>

                <div className="text-center flex flex-col justify-center min-h-[40px]">
                  <div className="text-sm font-bold text-gray-800">Weight</div>
                  <div className="text-xs text-gray-800">{pokemon.weight.minimum}-{pokemon.weight.maximum}</div>
                </div>

                {/* Second Row */}
                <div className="text-center flex flex-col justify-center min-h-[40px]">
                  <div className="text-sm font-bold text-gray-800">Max HP</div>
                  <div className="text-xs text-gray-800">{pokemon.maxHP}</div>
                </div>

                <div className="text-center flex flex-col justify-center min-h-[40px]">
                  <div className="text-sm font-bold text-gray-800">Max CP</div>
                  <div className="text-xs text-gray-800">{pokemon.maxCP}</div>
                </div>
              </div>

              {/* Attack Information Section */}
              {pokemon.attacks && (
                <div>
                  <h3 className="flex items-center text-md font-semibold text-gray-800 mb-2">
                    {/* <ImageWithFallback src="/game-icon/sword.svg" width={16} height={16} alt="Sword icon" className="mr-1" priority={false} loading="lazy" />  */}
                    <span>Attacks</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {/* Fast Attacks */}
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-1 bg-red-400 text-white rounded text-xs font-medium">
                          Fast Attacks
                        </span>
                      </div>
                      <div className="space-y-1">
                        {pokemon.attacks.fast.slice(0, 2).map((attack: Attack) => (
                          <div key={attack.name} className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-900">{attack.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">{attack.type}</span>
                              <span className="bg-red-600 text-white font-bold px-1 py-0.5 rounded text-xs">
                                {attack.damage}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Attacks */}
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-1 bg-blue-400 text-white rounded text-xs font-medium">
                          Special Attacks
                        </span>
                      </div>
                      <div className="space-y-1">
                        {pokemon.attacks.special.slice(0, 2).map((attack: Attack) => (
                          <div key={attack.name} className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-900">{attack.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">{attack.type}</span>
                              <span className="bg-red-600 text-white font-bold px-1 py-0.5 rounded text-xs">
                                {attack.damage}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Centered Breakline */}
        <div className="flex justify-center my-4 sm:my-5">
          <hr className="w-[100%] sm:w-[75%] border-gray-300" />
        </div>
        
        {/* Pokémon Details -  Column Layout */}
        <div className="flex flex-col md:grid md:grid-cols-1 gap-4">
          
          {/* Column 1: Resistances and Weaknesses - Full width */}
          <div className="w-full flex flex-col gap-6 h-auto">
            {/* Resistances */}
            {pokemon.resistant && pokemon.resistant.length > 0 && (
              <div className="border-1 border-white bg-white rounded-md p-3 md:p-3 md:pl-2 h-auto">
                <h3 className="flex items-center justify-start text-lg md:text-xl font-bold text-gray-800 p-1 mb-3">
                  {/* <ImageWithFallback src="/game-icon/shield.svg" width={24} height={24} alt="Shield icon" className="mr-1" priority={true} loading="eager" /> */}
                  <span>Resistances</span>
                </h3>
                <div className="flex flex-wrap gap-2 h-auto">
                  {pokemon.resistant.map((type: string) => (
                    <span key={type} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {pokemon.weaknesses && pokemon.weaknesses.length > 0 && (
              <div className="border-1 border-white bg-white rounded-md p-3 md:p-3 md:pl-2 h-auto">
                <h3 className="flex items-center justify-start text-lg md:text-xl font-bold text-gray-800 p-1 mb-3">
                   {/* <ImageWithFallback src="/game-icon/weak.svg" width={24} height={24} alt="Weakness icon" className="mr-1" priority={true} loading="eager" /> */}
                   <span>Weaknesses</span>
                 </h3>
                <div className="flex flex-wrap gap-2 h-auto">
                  {pokemon.weaknesses.map((type: string) => (
                    <span key={type} className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}