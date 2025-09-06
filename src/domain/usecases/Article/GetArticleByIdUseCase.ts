import { ArticleRepository } from "../../repositories/ArticleRepository";
import { Article } from "../../entities/Article";

export class GetArticleByIdUseCase {
  constructor(private articleRepo: ArticleRepository) {}

  async execute(id: number): Promise<Article | null> {
    return await this.articleRepo.getById(id);
  }
}
