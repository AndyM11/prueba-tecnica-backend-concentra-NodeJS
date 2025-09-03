import { ArticleRepository } from '../../repositories/ArticleRepository';
import { Article } from '../../entities/Article';

export class CreateArticleUseCase {
    constructor(private articleRepo: ArticleRepository) { }

    async execute(data: { barcode: string; description?: string; manufacturerId: number; stock?: number }): Promise<Article> {
        return await this.articleRepo.create(data);
    }
}
