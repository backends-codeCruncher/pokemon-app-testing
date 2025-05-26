import { UpdatePokemonDto } from './update-pokemon.dto';
import { validate } from 'class-validator';

describe('update-pokemon.dto.ts', () => {
  it('should validate with default value', async () => {
    const dto = new UpdatePokemonDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
