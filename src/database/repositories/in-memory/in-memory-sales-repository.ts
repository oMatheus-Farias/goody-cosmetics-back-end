import { randomBytes } from 'node:crypto';

import type { Sale, SaleItem } from '@prisma/client';

import type {
  ICreateSalesDto,
  IUpdateSalesDto,
} from '../../../use-cases/sales/dtos';
import type { ISalesData } from '../../../use-cases/sales/interfaces/return-sales-data';
import type { SalesRepository, SalesTFindAllWithParams } from '../interfaces';

export class InMemorySalesRepository implements SalesRepository {
  public items: ISalesData[] = [];

  async findById(saleId: string): Promise<ISalesData | null> {
    return this.items.find((sale) => sale.id === saleId) || null;
  }
  async findSalesItemsById(saleItemId: string): Promise<SaleItem | null> {
    const sale = this.items.find((sale) =>
      sale.items.some((item) => item.saleItemId === saleItemId),
    );

    if (!sale) {
      return null;
    }

    const saleItem =
      sale.items.find((item) => item.saleItemId === saleItemId) || null;

    return {
      id: saleItem?.saleItemId as string,
      saleId: sale.id,
      productId: randomBytes(16).toString('hex'),
      quantity: saleItem?.quantity as number,
      unitPrice: saleItem?.unitPrice as number,
      createdAt: new Date(),
    };
  }
  async findAllWithParams(
    page: number,
    searchTerm?: string,
  ): Promise<SalesTFindAllWithParams> {
    const sales = searchTerm
      ? this.items.filter((sale) =>
          sale.items.some((item) => item.productName.includes(searchTerm)),
        )
      : this.items;

    return {
      sales,
      meta: {
        pageIndex: page,
        limit: 10,
        countPerPage: 10,
        totalCount: sales.length,
      },
    };
  }
  async create(data: ICreateSalesDto): Promise<Pick<Sale, 'id'>> {
    const saleItems = data.items.map((item) => ({
      saleItemId: randomBytes(16).toString('hex'),
      productName: `Product-${item.productId}`,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const sale = {
      id: randomBytes(16).toString('hex'),
      saleDate: data.saleDate,
      items: saleItems,
      totalPrice: 0,
    };

    this.items.push(sale);

    return { id: sale.id };
  }
  async update(data: IUpdateSalesDto): Promise<void> {
    const sale = this.items.find((sale) => sale.id === data.saleId);

    if (!sale) {
      throw new Error('Sale not found');
    }

    if (data.saleDate) {
      sale.saleDate = data.saleDate;
    }
    if (data.items?.[0].quantity) {
      sale.items[0].quantity = data.items?.[0].quantity;
    }
    if (data.items?.[0].unitPrice) {
      sale.items[0].unitPrice = data.items?.[0].unitPrice;
    }
  }
  async deleteSaleItems(saleItemId: string): Promise<void> {
    const sale = this.items.find((sale) =>
      sale.items.some((item) => item.saleItemId === saleItemId),
    );

    if (!sale) {
      throw new Error('Sale not found');
    }

    sale.items = sale.items.filter((item) => item.saleItemId !== saleItemId);
  }
  async deleteSales(saleId: string): Promise<void> {
    this.items = this.items.filter((sale) => sale.id !== saleId);
  }
}
