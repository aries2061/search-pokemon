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
          {/* First Column: Pokemon Image with white background - Equal width on desktop */}
          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
            <div 
              className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center"
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

            {/* Row 3: Stats Grid with white background - 2 rows, 3 columns */}
            <div className="bg-white rounded-lg p-4 flex-1 min-h-[120px]">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Stats</h3>
              <div className="grid grid-cols-2 gap-3 h-auto">
                {/* First Row */}
                {/* HP */}
                <div className="text-center flex flex-col justify-center min-h-[60px]">
                  <div className="text-lg md:text-xl font-bold text-gray-800">Height</div>
                  <div className="text-sm md:text-md text-gray-800">{pokemon.height.minimum}-{pokemon.height.maximum}</div>
                </div>

                {/* Attack (using maxCP as attack stat) */}
                <div className="text-center flex flex-col justify-center min-h-[60px]">
                  <div className="text-lg md:text-xl font-bold text-gray-800">Weight</div>
                  <div className="text-sm md:text-md text-gray-800">{pokemon.weight.minimum}-{pokemon.weight.maximum}</div>
                </div>

                {/* Second Row */}
                {/* Special Attack (calculated) */}
                <div className="text-center flex flex-col justify-center min-h-[60px]">
                  <div className="text-lg md:text-xl font-bold text-gray-800">Max HP</div>
                  <div className="text-sm md:text-md text-gray-800">{pokemon.maxHP}</div>
                </div>

                {/* Special Defense (calculated) */}
                <div className="text-center flex flex-col justify-center min-h-[60px]">
                  <div className="text-lg md:text-xl font-bold text-gray-800">Max CP</div>
                  <div className="text-sm md:text-md text-gray-800">{pokemon.maxCP}</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Centered Breakline */}
        <div className="flex justify-center my-4 sm:my-5">
          <hr className="w-[100%] sm:w-[75%] border-gray-300" />
        </div>
        
        {/* Pokémon Details -  Column Layout */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          
          {/* Column 1: Attacks - Full width on mobile, first column on desktop */}
          {pokemon.attacks && (
            <div className="w-full md:col-span-1 flex flex-col items-start border-1 border-white bg-white rounded-md p-3 md:p-1 md:pl-2 min-h-[400px]">
              <h3 className="flex items-center justify-center text-lg md:text-xl font-bold text-gray-800 p-1 mb-3">
                <ImageWithFallback src="/game-icon/sword.svg" width={24} height={24} alt="Sword icon" className="mr-1" priority={false} loading="lazy" /> 
                <span>Attacks</span>
              </h3>
              <div className="flex flex-col gap-6 w-full">
                {/* Fast Attacks Table */}
                <div className="w-full">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-red-400 text-white rounded-md text-sm font-medium">
                      Fast Attacks
                    </span>
                  </div>
                  <div className="overflow-x-auto min-h-[120px]">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Attack Name
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Attack Type
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Damage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pokemon.attacks.fast.map((attack: Attack, index: number) => (
                          <tr key={attack.name} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                              {attack.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                              {attack.type}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className="bg-red-600 text-white font-bold px-2 py-1 rounded-md text-xs">
                                {attack.damage}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Special Attacks Table */}
                <div className="w-full">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-blue-400 text-white rounded-md text-sm font-medium">
                      Special Attacks
                    </span>
                  </div>
                  <div className="overflow-x-auto min-h-[120px]">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Attack Name
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Attack Type
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Damage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pokemon.attacks.special.map((attack: Attack, index: number) => (
                          <tr key={attack.name} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                              {attack.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                              {attack.type}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className="bg-red-600 text-white font-bold px-2 py-1 rounded-md text-xs">
                                {attack.damage}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Column 2: Resistances, Weaknesses, Evolution - Full width on mobile, second column on desktop */}
          <div className="w-full md:col-span-1 flex flex-col gap-6 min-h-[400px]">
            {/* Resistances */}
            {pokemon.resistant && pokemon.resistant.length > 0 && (
              <div className="border-1 border-white bg-white rounded-md p-3 md:p-1 md:pl-2 min-h-[150px]">
                <h3 className="flex items-center justify-center text-lg md:text-xl font-bold text-gray-800 p-1 mb-3">
                  <ImageWithFallback src="/game-icon/shield.svg" width={24} height={24} alt="Shield icon" className="mr-1" priority={true} loading="eager" />
                  <span>Resistances</span>
                </h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
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
              <div className="border-1 border-white bg-white rounded-md p-3 md:p-1 md:pl-2 min-h-[150px]">
                <h3 className="flex items-center justify-center text-lg md:text-xl font-bold text-gray-800 p-1 mb-3">
                   <ImageWithFallback src="/game-icon/weak.svg" width={24} height={24} alt="Weakness icon" className="mr-1" priority={true} loading="eager" />
                   <span>Weaknesses</span>
                 </h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {pokemon.weaknesses.map((type: string) => (
                    <span key={type} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Requirements and Evolutions */}
        {(pokemon.evolutionRequirements || (pokemon.evolutions && pokemon.evolutions.length > 0)) && (
          <div className="w-full bg-white rounded-md p-4 shadow-sm min-h-[200px] mt-6">
            {/* Evolution Requirements */}
            {pokemon.evolutionRequirements && (
              <div className="mb-6">
                <h3 className="flex items-center text-lg md:text-xl font-bold text-gray-800 mb-3">
                  <ImageWithFallback src="/game-icon/evolution.svg" width={24} height={24} alt="Evolution icon" className="mr-2" priority={false} loading="lazy" />
                  <span>Evolution Requirements</span>
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 min-h-[60px]">
                  <p className="text-sm text-blue-800 font-medium">
                    {pokemon.evolutionRequirements.name}: {pokemon.evolutionRequirements.amount}
                  </p>
                </div>
              </div>
            )}

            {/* Evolutions */}
            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
              <div>
                <h3 className="flex items-center text-lg md:text-xl font-bold text-gray-800 mb-3">
                  <ImageWithFallback src="/game-icon/evolution.svg" width={24} height={24} alt="Evolution icon" className="mr-2" priority={false} loading="lazy" />
                  <span>Evolutions</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-h-[120px]">
                  {pokemon.evolutions.map((evolution: Pokemon) => (
                    <div key={evolution.id} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => onEvolutionClick(evolution.name)}>
                      <div className="w-16 h-16 mb-2 relative" style={{ aspectRatio: '1/1' }}>
                        <ImageWithFallback
                          src={evolution.image || '/icon.svg'}
                          alt={evolution.name}
                          className="w-full h-full object-contain rounded-lg"
                          width={64}
                          height={64}
                          priority={false}
                          loading="lazy"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {evolution.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}