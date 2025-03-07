import type { Prisma, User } from '@prisma/client';

type TFindAllWithParams = {
  users: User[] | null;
  meta: {
    pageIndex: number;
    limit: number;
    countPerPage: number;
    totalCount: number;
  };
};

export interface UsersRepository {
  findById(
    userId: string,
  ): Promise<Pick<User, 'id' | 'firstName' | 'lastName'> | null>;
  findByNames(
    firstName: string,
    lastName: string,
  ): Promise<Pick<User, 'id' | 'email'> | null>;
  findByEmail(email: string): Promise<Pick<User, 'id' | 'email'> | null>;
  findAllWithParams(
    page: number,
    searchTerm?: string,
  ): Promise<TFindAllWithParams>;
  create(data: Prisma.UserCreateInput): Promise<void>;
  update(userId: string, data: Prisma.UserUpdateInput): Promise<void>;
  updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void>;
  forgotPassword(
    userId: string,
    resetToken: string,
    resetTokenExpiresAt: Date,
  ): Promise<void>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  setNullResetToken(userId: string): Promise<void>;
  delete(userId: string): Promise<void>;
}
