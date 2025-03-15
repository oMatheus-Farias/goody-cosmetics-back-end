import type { $Enums } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

import { PasswordHasherAdapter } from '../../adapters';
import type { PasswordHasher } from '../../adapters/interfaces';
import { InMemoryUsersRepository } from '../../database/repositories/in-memory';
import { UsersRepository } from '../../database/repositories/interfaces/users-repository';
import { CreateUsersUseCase } from './create';
import { FindAllUsersWithParamsUseCase } from './find-all-with-params';

let usersRepo: UsersRepository;
let passwordHasher: PasswordHasher;
let createUsersUseCase: CreateUsersUseCase;
let sut: FindAllUsersWithParamsUseCase;
const userData1 = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@email.com',
  password: 'password',
  role: 'ADMIN' as $Enums.UserRole,
};
const userData2 = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@email.com',
  password: 'password',
  role: 'ADMIN' as $Enums.UserRole,
};

describe('Find All Users With Params', () => {
  beforeEach(async () => {
    usersRepo = new InMemoryUsersRepository();
    passwordHasher = new PasswordHasherAdapter();
    createUsersUseCase = new CreateUsersUseCase(usersRepo, passwordHasher);
    sut = new FindAllUsersWithParamsUseCase(usersRepo);

    await Promise.all([
      createUsersUseCase.execute(userData1),
      createUsersUseCase.execute(userData2),
    ]);
  });

  it('should be able to find all users', async () => {
    const { users } = await sut.execute(0);

    expect(users).toHaveLength(2);
  });
});
