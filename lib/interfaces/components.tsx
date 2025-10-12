import { Pokemon } from '../types';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemonName: string) => void;
}

export interface PokemonGridProps {
  pokemons: Pokemon[];
}

export interface PokemonResultProps {
  pokemonName: string;
  onPokemonClick?: (pokemonName: string) => void;
  onBackClick?: () => void;
}