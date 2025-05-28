import { Pokemon } from './pokemon.entity';

describe('pokemon.entity.ts', () => {
  it('sould create a Pokemon instance', () => {
    const pokemon = new Pokemon();

    expect(pokemon).toBeInstanceOf(Pokemon);
  });

  it('should have these properties', () => {
    const pokemon = new Pokemon();

    pokemon.id = 1;
    pokemon.name = 'Charmander';
    pokemon.type = 'Fuego';
    pokemon.hp = 39;
    pokemon.sprites = ['sprite1.png'];

    expect(pokemon).toEqual({
      id: 1,
      name: 'Charmander',
      type: 'Fuego',
      hp: 39,
      sprites: ['sprite1.png'],
    });
  });
});
