import { getSuggestions, savePokemonName } from '@/lib/pokemonSearchUtils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('pokemonSearchUtils', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('getSuggestions', () => {
    test('returns empty array when input is empty', () => {
      expect(getSuggestions('')).toEqual([]);
    });

    test('returns filtered suggestions based on input', () => {
      // Setup mock localStorage data
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['Pikachu', 'Charizard', 'Bulbasaur']));
      
      // Test with 'cha' input
      const result = getSuggestions('cha');
      expect(result).toContain('Charizard');
      expect(result).not.toContain('Pikachu');
      expect(result).not.toContain('Bulbasaur');
    });

    test('returns case-insensitive matches', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['Pikachu', 'Charizard', 'Bulbasaur']));
      
      const result = getSuggestions('pIkA');
      expect(result).toContain('Pikachu');
    });

    test('handles localStorage returning null', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = getSuggestions('pika');
      expect(result).toEqual([]);
    });
  });

  describe('savePokemonName', () => {
    test('saves new pokemon name to localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      savePokemonName('Pikachu');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pokemonNames', JSON.stringify(['Pikachu']));
    });

    test('adds pokemon name to existing list without duplicates', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['Charizard', 'Bulbasaur']));
      
      savePokemonName('Pikachu');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemonNames', 
        JSON.stringify(['Charizard', 'Bulbasaur', 'Pikachu'])
      );
    });

    test('does not add duplicate pokemon names', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['Pikachu', 'Charizard']));
      
      savePokemonName('Pikachu');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemonNames', 
        JSON.stringify(['Pikachu', 'Charizard'])
      );
    });
  });
});