import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const data = { name: 'Pikachu', type: 'Electric' };

    const result = await service.create(data);

    expect(result).toEqual(
      expect.objectContaining({
        hp: expect.any(Number),
        id: expect.any(Number),
        name: data.name,
        sprites: expect.any(Array),
        type: data.type,
      }),
    );
  });

  it('should return pokemon if exists', async () => {
    const id = 4;

    const result = await service.findOne(id);

    expect(result).toEqual({
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      ],
    });
  });

  it('should return 404 error if pokemon not exists', async () => {
    const id = 400_000;

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(
      `Pokemon with id ${id} not found`,
    );
  });

  it('should check props of the pokemon', async () => {
    const id = 4;

    const result = await service.findOne(id);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');

    expect(result).toEqual(
      expect.objectContaining({ id: id, hp: expect.any(Number) }),
    );
  });

  it('should find all pokemon and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });

    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(10);

    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons);
  });

  it('should return paginated pokemons in cache', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });

    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons);
  });

  // Tarea
  it('should throw an error if pokemon exists', async () => {
    const data = { name: 'Pikachu', type: 'Electric' };
    await service.create(data);

    try {
      await service.create(data);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `Pokemon with name ${data.name} already exists`,
      );
    }
  });

  it('should return pokemons from cache', async () => {
    const limit = 10;
    const page = 1;

    await service.findAll({ limit, page });

    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get');

    await service.findAll({ limit, page });

    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith(`${limit}-${page}`);
  });

  it('should return pokemon from cache', async () => {
    await service.findOne(1);
    const cacheSpy = jest.spyOn(service.pokemonsCache, 'get');
    await service.findOne(1);

    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith(1);
  });

  it('should update a pokemon', async () => {
    const cacheSpy = jest.spyOn(service.pokemonsCache, 'set');

    const id = 1;

    const updateDto: UpdatePokemonDto = {
      name: 'Otro Pokemon',
    };

    const pokemon = await service.update(id, updateDto);

    expect(pokemon).toEqual(
      expect.objectContaining({
        id,
        ...updateDto,
      }),
    );

    expect(cacheSpy).toHaveBeenCalled();
  });

  it('should delete a pokemon', async () => {
    const cacheSpy = jest.spyOn(service.pokemonsCache, 'delete');

    const id = 1;

    await service.remove(id);

    expect(cacheSpy).toHaveBeenCalled();
  });
});
