import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have called the service with correct parameters', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    jest.spyOn(service, 'findAll');

    await controller.findAll(dto);

    expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  // Recomendada para pruebas unitarias
  it('should have called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons));

    const pokemons = await controller.findAll(dto);

    expect(pokemons).toBe(mockPokemons);
  });

  it('should have called the service with the correct id (findOne)', async () => {
    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    const id = 1;

    const pokemon = await controller.findOne(id.toString());

    expect(spy).toHaveBeenCalledWith(id);
    expect(pokemon).toEqual(mockPokemons[0]);
  });

  it('should have called the service with the correct id and data (update)', async () => {
    jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve(mockPokemons[1]));

    const id = 1;
    const data: UpdatePokemonDto = {
      name: 'Bulbasuar Omega',
    };

    await controller.update(id.toString(), data);

    expect(service.update).toHaveBeenCalledWith(id, data);
  });

  it('should have called delete with the correct id (delete)', async () => {
    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve(`Pokemon eliminado`));

    const id = 2;
    const result = await controller.remove(id.toString());

    expect(result).toBe(`Pokemon eliminado`);
  });

  // Tarea
  it('should call create service method', async () => {
    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    await controller.create({
      name: 'Pikachu',
      type: 'Electric',
    });

    expect(service.create).toHaveBeenCalledWith({
      name: 'Pikachu',
      type: 'Electric',
    });
  });
});
