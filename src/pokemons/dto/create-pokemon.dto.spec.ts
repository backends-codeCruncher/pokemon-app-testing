import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';
import { plainToInstance } from 'class-transformer';

describe('create-pokemon.dto.ts', () => {
  it('should validate with default value', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'electric';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if name is not present', async () => {
    const dto = new CreatePokemonDto();

    dto.type = 'electric';

    const errors = await validate(dto);

    const nameError = errors.find((e) => e.property === 'name');

    expect(nameError).toBeDefined();
  });

  it('should be invalid if type is not present', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';

    const errors = await validate(dto);

    const typeError = errors.find((e) => e.property === 'type');

    expect(typeError).toBeDefined();
  });

  it('should validate with valid data', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'electric';
    dto.hp = 200;
    dto.sprites = ['s1', 's2'];

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate with invalid sprites', async () => {
    const input = {
      name: 'Pikachu',
      type: 'electric',
      sprites: [1],
    };

    const dto = plainToInstance(CreatePokemonDto, input);

    const errors = await validate(dto);

    const spritesError = errors.find((e) => e.property === 'sprites');
    const constraints = spritesError?.constraints;

    expect(spritesError).toBeDefined();
    expect(constraints).toEqual({
      isString: 'each value in sprites must be a string',
    });
  });

  it('should not validate with invalid hp', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'electric';
    dto.hp = -200;

    const errors = await validate(dto);

    const hpError = errors.find((e) => e.property === 'hp');
    const constraints = hpError?.constraints;

    expect(hpError).toBeDefined();
    expect(constraints).toEqual({
      min: 'hp must not be less than 0',
    });
  });
});
