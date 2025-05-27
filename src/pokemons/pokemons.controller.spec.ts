import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';

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
});
