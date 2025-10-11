import { bulbasaurMock, charmanderMock, squirtleMock } from './mocks/pokemon-data';

describe('Pokémon Type Tests', () => {
  test('Bulbasaur should be Grass and Poison type', () => {
    expect(bulbasaurMock.types).toContain('Grass');
    expect(bulbasaurMock.types).toContain('Poison');
    expect(bulbasaurMock.types.length).toBe(2);
  });

  test('Charmander should be Fire type', () => {
    expect(charmanderMock.types).toContain('Fire');
    expect(charmanderMock.types.length).toBe(1);
  });

  test('Squirtle should be Water type', () => {
    expect(squirtleMock.types).toContain('Water');
    expect(squirtleMock.types.length).toBe(1);
  });
});