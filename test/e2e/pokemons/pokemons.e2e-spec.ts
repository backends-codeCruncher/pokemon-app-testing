import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { CreatePokemonDto } from '../../../src/pokemons/dto/create-pokemon.dto';

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
});
