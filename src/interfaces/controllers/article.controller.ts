import { PrismaArticleRepository } from '../../infrastructure/repositories/PrismaArticleRepository';
import { GetAllArticlesUseCase } from '../../domain/usecases/Article/GetAllArticlesUseCase';
import { CreateArticleUseCase } from '../../domain/usecases/Article/CreateArticleUseCase';
import { GetArticleByIdUseCase } from '../../domain/usecases/Article/GetArticleByIdUseCase';
import { UpdateArticleUseCase } from '../../domain/usecases/Article/UpdateArticleUseCase';
import { DeleteArticleUseCase } from '../../domain/usecases/Article/DeleteArticleUseCase';
import { Request, Response } from 'express';
import { z } from 'zod';

const articleRepo = new PrismaArticleRepository();
export const getAllArticlesUseCase = new GetAllArticlesUseCase(articleRepo); // Solo exportar para pruebas unitarias
export const createArticleUseCase = new CreateArticleUseCase(articleRepo); // Solo exportar para pruebas unitarias
export const getArticleByIdUseCase = new GetArticleByIdUseCase(articleRepo); // Solo exportar para pruebas unitarias
export const updateArticleUseCase = new UpdateArticleUseCase(articleRepo); // Solo exportar para pruebas unitarias
export const deleteArticleUseCase = new DeleteArticleUseCase(articleRepo); // Solo exportar para pruebas unitarias

const articleSchema = z.object({
    barcode: z.string().min(5, 'Barcode must have at least 5 characters'),
    description: z.string().optional(),
    manufacturerId: z.number(),
    stock: z.number().int().min(0).optional(),
});

export const getArticles = async (req: Request, res: Response) => {
    try {
        const { description, manufacturerId, page, per_page, barcode, stock } = req.query;
        const options: any = {};
        if (description) options.description = String(description);
        if (manufacturerId) options.manufacturerId = Number(manufacturerId);
        if (barcode) options.barcode = String(barcode);
        if (stock !== undefined) options.stock = Number(stock);
        if (page) options.page = Number(page);
        if (per_page) options.per_page = Number(per_page);
        const result = await getAllArticlesUseCase.execute(Object.keys(options).length ? options : undefined);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error getting articles', details: error instanceof Error ? error.message : error });
    }
};

export const createArticle = async (req: Request, res: Response, next: Function) => {
    try {
        const parse = articleSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Invalid data', details: parse.error.issues });
        }
        const article = await createArticleUseCase.execute(parse.data);
        res.status(201).json(article);
    } catch (error: any) {
        next(error);
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }
        const article = await getArticleByIdUseCase.execute(Number(id));
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error getting article', details: error instanceof Error ? error.message : error });
    }
};

export const updateArticle = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }
        const parse = articleSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Invalid data', details: parse.error.issues });
        }
        const article = await updateArticleUseCase.execute(Number(id), parse.data);
        res.json(article);
    } catch (error: any) {
        next(error);
    }
};

export const deleteArticle = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }
        await deleteArticleUseCase.execute(Number(id));
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};
