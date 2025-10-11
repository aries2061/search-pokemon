import { Pokemon } from '../types';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PokemonCardProps {
  pokemon: Pokemon;
}

export interface PokemonGridProps {
  pokemons: Pokemon[];
}

export interface PokemonResultProps {
  pokemonName: string;
}