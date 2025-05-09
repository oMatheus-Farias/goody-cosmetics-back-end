import type { Category } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  InMemoryCategoriesRepository,
  InMemoryProductsRepository,
} from '../../database/repositories/in-memory';
import type {
  CategoriesRepository,
  ProductsRepository,
} from '../../database/repositories/interfaces';
import { AlreadyExistsError, NotFoundError } from '../../errors';
import { CreateCategoriesUseCase } from '../categories/create';
import { CreateProductsUseCase } from './create';
import type { IProductsDto } from './dtos/products-dto';

let productsRepo: ProductsRepository;
let categoriesRepo: CategoriesRepository;
let categoriesUseCase: CreateCategoriesUseCase;
let sut: CreateProductsUseCase;
let category: Pick<Category, 'id' | 'name'> | null;
let productData: IProductsDto;
const categoryName = 'Category Name';

describe('Create Products', () => {
  beforeEach(async () => {
    productsRepo = new InMemoryProductsRepository();
    categoriesRepo = new InMemoryCategoriesRepository();
    categoriesUseCase = new CreateCategoriesUseCase(categoriesRepo);
    sut = new CreateProductsUseCase(productsRepo, categoriesRepo);

    await categoriesUseCase.execute({ name: categoryName });
    category = await categoriesRepo.findByName(categoryName);

    const mockFiles = [
      new File(
        [
          fs.readFileSync(
            path.resolve(__dirname, '../../../assets/test-image.jpg'),
          ),
        ],
        'image1.jpg',
        { type: 'image/jpeg' },
      ),
      new File(
        [
          fs.readFileSync(
            path.resolve(__dirname, '../../../assets/test-image.jpg'),
          ),
        ],
        'image2.jpg',
        { type: 'image/jpeg' },
      ),
    ];

    productData = {
      name: 'Product Name',
      description: 'Product Description',
      categoryId: category!.id,
      oldPrice: 10,
      currentPrice: 5,
      stockQuantity: 10,
      imageFiles: mockFiles,
    };
  });

  it('should be able create product', async () => {
    await sut.execute(productData);

    const product = await productsRepo.findByName(productData.name);

    expect(product).not.toBe(null);
  });

  it('should throw error if product already exists', async () => {
    await sut.execute(productData);

    await expect(sut.execute(productData)).rejects.toBeInstanceOf(
      AlreadyExistsError,
    );
  });

  it('should throw error if category not exists', async () => {
    await expect(
      sut.execute({
        ...productData,
        categoryId: 'invalid-category-id',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
