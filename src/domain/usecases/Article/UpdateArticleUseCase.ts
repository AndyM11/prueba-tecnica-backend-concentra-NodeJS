import { ArticleRepository } from "../../repositories/ArticleRepository";
import { Article } from "../../entities/Article";

export class UpdateArticleUseCase {
  constructor(private articleRepo: ArticleRepository) {}

  async execute(
    id: number,
    data: {
      barcode?: string;
      description?: string;
      manufacturerId?: number;
      stock?: number;
    },
  ): Promise<Article | null> {
    return await this.articleRepo.update(id, data);
  }
}
