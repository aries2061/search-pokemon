export interface Pokemon {
  id: string;
  number: string;
  name: string;
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  maxHP: number;
  image: string;
  compressedImage?: string;
  attacks?: {
    fast: Attack[];
    special: Attack[];
  };
  evolutions?: Pokemon[];
}

export interface Attack {
  name: string;
  type: string;
  damage: number;
}

export interface PokemonQueryResponse {
  pokemon: Pokemon;
}

export interface PokemonsQueryResponse {
  pokemons: Pokemon[];
}