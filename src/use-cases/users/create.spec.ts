import type { $Enums } from '@prisma/client';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import type { PasswordHasher } from '../../adapters/interfaces/password-hasher';
import { PasswordHasherAdapter } from '../../adapters/password-hasher-adapter';
import { InMemoryUsersRepository } from '../../database/repositories/in-memory';
import { UsersRepository } from '../../database/repositories/interfaces/users-repository';
import { AlreadyExistsError } from '../../errors';
import { sendEmail } from '../../libs/nodemailer/config/mail';
import { CreateUsersUseCase } from './create';

vi.mock('../../libs/nodemailer/config/mail', () => ({
  sendEmail: vi.fn(),
}));

let usersRepo: UsersRepository;
let passwordHasher: PasswordHasher;
let sut: CreateUsersUseCase;
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@email.com',
  password: 'password',
  role: 'ADMIN' as $Enums.UserRole,
};

describe('Create User', () => {
  beforeEach(async () => {
    usersRepo = new InMemoryUsersRepository();
    passwordHasher = new PasswordHasherAdapter();
    sut = new CreateUsersUseCase(usersRepo, passwordHasher);

    await sut.execute(userData);
  });

  it('should be able create user', async () => {
    const user = await usersRepo.findByEmail(userData.email);
    (sendEmail as Mock).mockResolvedValue('Email sending success');

    expect(user).not.toBe(null);
    expect(sendEmail).toHaveBeenCalledWith(
      userData.firstName,
      userData.email,
      userData.password,
      null,
    );
  });

  it('should throw error if email is already in use', async () => {
    const otherUserFirstName = 'Jane';

    await expect(
      sut.execute({
        ...userData,
        firstName: otherUserFirstName,
      }),
    ).rejects.toBeInstanceOf(AlreadyExistsError);
  });

  it('should throw error if names are already in use', async () => {
    const otherUserEmail = 'janedoe@email.com';

    await expect(
      sut.execute({
        ...userData,
        email: otherUserEmail,
      }),
    ).rejects.toBeInstanceOf(AlreadyExistsError);
  });
});
