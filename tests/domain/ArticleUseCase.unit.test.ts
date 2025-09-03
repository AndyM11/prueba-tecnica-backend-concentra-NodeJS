import { ArticleRepository } from '../../src/domain/repositories/ArticleRepository';
import { GetAllArticlesUseCase } from '../../src/domain/usecases/Article/GetAllArticlesUseCase';
import { GetArticleByIdUseCase } from '../../src/domain/usecases/Article/GetArticleByIdUseCase';
import { CreateArticleUseCase } from '../../src/domain/usecases/Article/CreateArticleUseCase';
import { UpdateArticleUseCase } from '../../src/domain/usecases/Article/UpdateArticleUseCase';
import { DeleteArticleUseCase } from '../../src/domain/usecases/Article/DeleteArticleUseCase';

describe('Article UseCases (domain)', () => {
    const repo: ArticleRepository = {
        getAll: jest.fn().mockResolvedValue([{ id: 1, barcode: '12345', manufacturerId: 1, stock: 0 }]),
        getById: jest.fn().mockResolvedValue({ id: 1, barcode: '12345', manufacturerId: 1, stock: 0 }),
        create: jest.fn().mockResolvedValue({ id: 1, barcode: '12345', manufacturerId: 1, stock: 0 }),
        update: jest.fn().mockResolvedValue({ id: 1, barcode: '12345', manufacturerId: 1, stock: 0 }),
        delete: jest.fn().mockResolvedValue(undefined)
    };

    it('GetAllArticlesUseCase returns articles', async () => {
        const usecase = new GetAllArticlesUseCase(repo);
        const result = await usecase.execute();
        expect(result).toHaveLength(1);
    });

    it('GetArticleByIdUseCase returns article', async () => {
        const usecase = new GetArticleByIdUseCase(repo);
        const result = await usecase.execute(1);
        expect(result).toHaveProperty('barcode');
    });

    it('CreateArticleUseCase creates article', async () => {
        const usecase = new CreateArticleUseCase(repo);
        const result = await usecase.execute({ barcode: '12345', manufacturerId: 1 });
        expect(result).toHaveProperty('id');
    });

    it('UpdateArticleUseCase updates article', async () => {
        const usecase = new UpdateArticleUseCase(repo);
        const result = await usecase.execute(1, { barcode: '54321' });
        expect(result).toHaveProperty('barcode', '12345');
    });

    it('DeleteArticleUseCase deletes article', async () => {
        const usecase = new DeleteArticleUseCase(repo);
        await expect(usecase.execute(1)).resolves.toBeUndefined();
    });
});
