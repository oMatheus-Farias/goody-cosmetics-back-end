import type { Category, Prisma } from '@prisma/client';

type TFindAllWithParams = {
  categories: Category[] | null;
  meta: {
    pageIndex: number;
    limit: number;
    countPerPage: number;
    totalCount: number;
  };
};

export interface CategoriesRepository {
  findById(categoryId: string): Promise<Pick<Category, 'id' | 'name'> | null>;
  findAllWithParams(
    page: number,
    searchTerm?: string,
  ): Promise<TFindAllWithParams>;
  create(data: Prisma.CategoryCreateInput): Promise<void>;
  update(categoryId: string, data: Prisma.CategoryUpdateInput): Promise<void>;
  delete(categoryId: string): Promise<void>;
}
