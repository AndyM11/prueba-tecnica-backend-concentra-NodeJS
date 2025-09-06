import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ArticleFilterOptions } from "../../domain/entities/Types";
import { CreateArticleUseCase } from "../../domain/usecases/Article/CreateArticleUseCase";
import { DeleteArticleUseCase } from "../../domain/usecases/Article/DeleteArticleUseCase";
import { GetAllArticlesUseCase } from "../../domain/usecases/Article/GetAllArticlesUseCase";
import { GetArticleByIdUseCase } from "../../domain/usecases/Article/GetArticleByIdUseCase";
import { UpdateArticleUseCase } from "../../domain/usecases/Article/UpdateArticleUseCase";
import { PrismaArticleRepository } from "../../infrastructure/repositories/PrismaArticleRepository";

const articleRepo = new PrismaArticleRepository();
export const getAllArticlesUseCase = new GetAllArticlesUseCase(articleRepo); // Exportado solo para pruebas unitarias
export const createArticleUseCase = new CreateArticleUseCase(articleRepo); // Exportado solo para pruebas unitarias
export const getArticleByIdUseCase = new GetArticleByIdUseCase(articleRepo); // Exportado solo para pruebas unitarias
export const updateArticleUseCase = new UpdateArticleUseCase(articleRepo); // Exportado solo para pruebas unitarias
export const deleteArticleUseCase = new DeleteArticleUseCase(articleRepo); // Exportado solo para pruebas unitarias

const articleSchema = z.object({
  barcode: z
    .string()
    .min(5, "El código de barras debe tener al menos 5 caracteres"),
  description: z.string().optional(),
  manufacturerId: z.number(),
  stock: z.number().int().min(0).optional(),
});

export const getArticles = async (req: Request, res: Response) => {
  try {
    const { description, manufacturerId, page, per_page, barcode, stock } =
      req.query;
    const options: ArticleFilterOptions = {};
    if (typeof description === "string") options.description = String(description);
    if (typeof manufacturerId === "string") options.manufacturerId = Number(manufacturerId);
    if (typeof barcode === "string") options.barcode = String(barcode);
    if (typeof stock === "string") options.stock = Number(stock);
    if (page !== undefined) options.page = Number(page);
    if (per_page !== undefined) options.per_page = Number(per_page);
    const result = await getAllArticlesUseCase.execute(
      Object.keys(options).length ? options : undefined,
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los artículos",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = articleSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const article = await createArticleUseCase.execute(parse.data);
    res.status(201).json(article);
  } catch (error: unknown) {
    next(error);
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de artículo inválido" });
    }
    const article = await getArticleByIdUseCase.execute(Number(id));
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });
    res.json(article);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener el artículo",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de artículo inválido" });
    }
    const parse = articleSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const article = await updateArticleUseCase.execute(Number(id), parse.data);
    res.json(article);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de artículo inválido" });
    }
    await deleteArticleUseCase.execute(Number(id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
