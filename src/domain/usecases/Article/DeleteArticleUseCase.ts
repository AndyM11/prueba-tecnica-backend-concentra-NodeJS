import { ArticleRepository } from "../../repositories/ArticleRepository";

export class DeleteArticleUseCase {
  constructor(private articleRepo: ArticleRepository) {}

  async execute(id: number): Promise<void> {
    await this.articleRepo.delete(id);
  }
}
