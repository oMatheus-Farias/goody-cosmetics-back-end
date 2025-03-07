import type { Prisma, User } from '@prisma/client';

import { prisma } from '../../../app';
import { UsersRepository } from '../interfaces';

export class PrismaUsersRepository implements UsersRepository {
  async findById(
    userId: string,
  ): Promise<Pick<User, 'id' | 'firstName' | 'lastName'> | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }
  async findByNames(
    firstName: string,
    lastName: string,
  ): Promise<Pick<User, 'id' | 'email'> | null> {
    return await prisma.user.findFirst({
      where: {
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
  async findByEmail(email: string): Promise<Pick<User, 'id' | 'email'> | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }
  async findAllWithParams(
    page: number,
    searchTerm?: string,
  ): Promise<{
    users: User[] | null;
    meta: {
      pageIndex: number;
      limit: number;
      countPerPage: number;
      totalCount: number;
    };
  }> {
    const users = await prisma.user.findMany({
      skip: page * 10,
      take: 10,
      orderBy: { firstName: 'asc' },
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerm,
            },
          },
          {
            lastName: {
              contains: searchTerm,
            },
          },
        ],
      },
    });

    const count = await prisma.user.count({
      skip: page * 10,
      take: 10,
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerm,
            },
          },
          {
            lastName: {
              contains: searchTerm,
            },
          },
        ],
      },
    });

    const totalCount = await prisma.user.count({
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerm,
            },
          },
          {
            lastName: {
              contains: searchTerm,
            },
          },
        ],
      },
    });

    return {
      users,
      meta: {
        pageIndex: page,
        limit: 10,
        countPerPage: count,
        totalCount,
      },
    };
  }
  async create(data: Prisma.UserCreateInput): Promise<void> {
    await prisma.user.create({
      data,
    });
  }
  async update(userId: string, data: Prisma.UserUpdateInput): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
        passwordHash: oldPassword,
      },
      data: {
        passwordHash: newPassword,
      },
    });
  }
  async forgotPassword(
    userId: string,
    resetToken: string,
    resetTokenExpiresAt: Date,
  ): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });
  }
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: newPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
  }
  async setNullResetToken(userId: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
  }
  async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
