/**
 * Utility functions for managing Pokémon search history in localStorage
 */

const STORAGE_KEY = 'pokemonNames';

/**
 * Get the list of previously searched Pokémon names from localStorage
 */
export const getSavedPokemonNames = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedNames = localStorage.getItem(STORAGE_KEY);
    return savedNames ? JSON.parse(savedNames) : [];
  } catch (error) {
    console.error('Error retrieving Pokémon names from localStorage:', error);
    return [];
  }
};

/**
 * Save a Pokémon name to localStorage
 * Uses Set to ensure uniqueness and better performance
 */
export const savePokemonName = (name: string): void => {
  if (typeof window === 'undefined' || !name) return;
  
  try {
    const currentNames = getSavedPokemonNames();
    const namesSet = new Set(currentNames);
    
    // Add the new name and convert back to array
    namesSet.add(name);
    const updatedNames = Array.from(namesSet);
    
    // Store back in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNames));
  } catch (error) {
    console.error('Error saving Pokémon name to localStorage:', error);
  }
};

/**
 * Get suggestions based on the current input
 */
export const getSuggestions = (input: string): string[] => {
  if (!input) return [];
  
  const savedNames = getSavedPokemonNames();
  const lowerInput = input.toLowerCase();
  
  return savedNames
    .filter(name => name.toLowerCase().includes(lowerInput))
    .slice(0, 5); // Limit to 5 suggestions
};