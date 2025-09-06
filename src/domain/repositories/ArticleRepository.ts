import { Article } from "../entities/Article";

export interface ArticleRepository {
  getAll(params?: {
    description?: string;
    manufacturerId?: number;
    page?: number;
    per_page?: number;
  }): Promise<Article[]>;
  getById(id: number): Promise<Article | null>;
  create(data: {
    barcode: string;
    description?: string;
    manufacturerId: number;
    stock?: number;
  }): Promise<Article>;
  update(
    id: number,
    data: {
      barcode?: string;
      description?: string;
      manufacturerId?: number;
      stock?: number;
    },
  ): Promise<Article | null>;
  delete(id: number): Promise<void>;
}
