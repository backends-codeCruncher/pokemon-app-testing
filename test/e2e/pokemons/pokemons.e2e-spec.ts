import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { CreatePokemonDto } from '../../../src/pokemons/dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../../../src/pokemons/dto/update-pokemon.dto';
import { Pokemon } from '../../../src/pokemons/entities/pokemon.entity';

describe('Pokemons (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  it('/pokemons (POST) - with no body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'name must be a string',
        'name should not be empty',
        'type must be a string',
        'type should not be empty',
      ]),
    );
  });

  it('/pokemons (POST) - with valid body', async () => {
    const dto: CreatePokemonDto = {
      name: 'Pikachu',
      type: 'Electric',
    };

    const response = await request(app.getHttpServer())
      .post('/pokemons')
      .send(dto);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      name: dto.name,
      type: dto.type,
      hp: dto.hp ?? 0,
      sprites: dto.sprites ?? [],
      id: expect.any(Number),
    });
  });

  it('/pokemons (GET) - should paginated list of pokemons', async () => {
    const response = await request(app.getHttpServer()).get('/pokemons').query({
      limit: 5,
      page: 1,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);

    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('sprites');
    });
  });

  it('/pokemons/:id (GET) - should return a pokemon by id', async () => {
    const response = await request(app.getHttpServer()).get('/pokemons/25');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 25,
      name: 'pikachu',
      type: 'electric',
      hp: 35,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
      ],
    });
  });

  it('/pokemons/:id (GET) - should return Not Found', async () => {
    const pokemonId = 2500;

    const response = await request(app.getHttpServer()).get(
      `/pokemons/${pokemonId}`,
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      `Pokemon with id ${pokemonId} not found`,
    );
  });

  it('/pokemons/:id (PATCH) - should update pokemon', async () => {
    const dto: UpdatePokemonDto = {
      name: 'Pikachu Omega',
    };

    const pokemonId = 25;

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${pokemonId}`)
      .send(dto);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 25,
      name: dto.name,
      type: 'electric',
      hp: 35,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
      ],
    });
  });

  it('/pokemons/:id (PATCH) - should throw an 404', async () => {
    const dto: UpdatePokemonDto = {
      name: 'Pikachu Omega',
    };

    const pokemonId = 2500;

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${pokemonId}`)
      .send(dto);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: `Pokemon with id ${pokemonId} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/pokemons/:id (DELETE) - should remove pokemon', async () => {
    const pokemonId = 25;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${pokemonId}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Pokemon pikachu removed!');
  });

  it('/pokemons/:id (DELETE) - should throw an 404', async () => {
    const pokemonId = 2500;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${pokemonId}`,
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: `Pokemon with id ${pokemonId} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });
});
