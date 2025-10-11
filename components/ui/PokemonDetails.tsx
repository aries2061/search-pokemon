'use client';

import React from 'react';
import Image from 'next/image';
import { PokemonDetailsProps } from '../../lib/interfaces/ui';

export function PokemonDetails({ pokemon, className = '' }: PokemonDetailsProps) {
  return (
    <div className={`pokemon-details ${className}`}>
      <div className="pokemon-details-header">
        <h2 className="pokemon-details-title">{pokemon.name}</h2>
        <span className="pokemon-details-number">#{pokemon.number}</span>
      </div>
      
      <div className="pokemon-details-image-container">
        {
          pokemon.image? (
            <Image
              src={pokemon.image}
              alt={pokemon.name}
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
        }
      </div>
      
      <div className="pokemon-details-info">
        <div className="pokemon-details-types">
          {pokemon.types?.map((type) => (
            <span key={type} className={`pokemon-type pokemon-type-${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
        
        <div className="pokemon-details-stats">
          <div className="pokemon-details-stat">
            <span className="pokemon-details-stat-label">Height</span>
            <span className="pokemon-details-stat-value">{pokemon.height?.minimum} - {pokemon.height?.maximum}</span>
          </div>
          <div className="pokemon-details-stat">
            <span className="pokemon-details-stat-label">Weight</span>
            <span className="pokemon-details-stat-value">{pokemon.weight?.minimum} - {pokemon.weight?.maximum}</span>
          </div>
        </div>
        
        {pokemon.evolutions && pokemon.evolutions.length > 0 && (
          <div className="pokemon-details-evolutions">
            <h3 className="pokemon-details-section-title">Evolutions</h3>
            <div className="pokemon-details-evolutions-list">
              {pokemon.evolutions.map((evolution) => (
                <div key={evolution.id} className="pokemon-details-evolution">
                  <span className="pokemon-details-evolution-name">{evolution.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}