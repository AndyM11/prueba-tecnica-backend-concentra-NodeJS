import { ArticleRepository } from "../../repositories/ArticleRepository";
import { Article } from "../../entities/Article";

export class GetAllArticlesUseCase {
  constructor(private articleRepo: ArticleRepository) {}

  async execute(params?: {
    description?: string;
    manufacturerId?: number;
    page?: number;
    per_page?: number;
  }): Promise<Article[]> {
    return await this.articleRepo.getAll(params);
  }
}
