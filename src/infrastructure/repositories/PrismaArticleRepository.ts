import { ArticleRepository } from '../../domain/repositories/ArticleRepository';
import { Article } from '../../domain/entities/Article';
import { PrismaClient } from '@prisma/client';

export class PrismaArticleRepository implements ArticleRepository {
    private prisma: PrismaClient;
    constructor(prismaInstance?: PrismaClient) {
        this.prisma = prismaInstance || new PrismaClient();
    }
    async getAll(params?: { description?: string; manufacturerId?: number; barcode?: string; stock?: number; page?: number; per_page?: number }): Promise<Article[]> {
        const { description, manufacturerId, barcode, stock, page = 1, per_page = 10 } = params || {};
        const where: any = {};
        if (description) where.descripcion = { contains: description };
        if (manufacturerId) where.fabricanteId = manufacturerId;
        if (barcode) where.codigoBarras = { contains: barcode };
        if (stock !== undefined) where.stock = stock;
        const articles = await this.prisma.articulo.findMany({
            where,
            skip: (page - 1) * per_page,
            take: per_page,
        });
        return articles.map(a => ({
            id: a.id,
            barcode: a.codigoBarras,
            description: a.descripcion ?? undefined,
            manufacturerId: a.fabricanteId,
            stock: a.stock,
        }));
    }

    async getById(id: number): Promise<Article | null> {
        const a = await this.prisma.articulo.findUnique({ where: { id } });
        if (!a) return null;
        return {
            id: a.id,
            barcode: a.codigoBarras,
            description: a.descripcion ?? undefined,
            manufacturerId: a.fabricanteId,
            stock: a.stock,
        };
    }

    async create(data: { barcode: string; description?: string; manufacturerId: number; stock?: number }): Promise<Article> {
        const a = await this.prisma.articulo.create({
            data: {
                codigoBarras: data.barcode,
                descripcion: data.description,
                fabricanteId: data.manufacturerId,
                stock: data.stock ?? 0,
            },
        });
        return {
            id: a.id,
            barcode: a.codigoBarras,
            description: a.descripcion ?? undefined,
            manufacturerId: a.fabricanteId,
            stock: a.stock,
        };
    }

    async update(id: number, data: { barcode?: string; description?: string; manufacturerId?: number; stock?: number }): Promise<Article | null> {
        const a = await this.prisma.articulo.update({
            where: { id },
            data: {
                codigoBarras: data.barcode,
                descripcion: data.description,
                fabricanteId: data.manufacturerId,
                stock: data.stock,
            },
        });
        return {
            id: a.id,
            barcode: a.codigoBarras,
            description: a.descripcion ?? undefined,
            manufacturerId: a.fabricanteId,
            stock: a.stock,
        };
    }

    async delete(id: number): Promise<void> {
        await this.prisma.articulo.delete({ where: { id } });
    }
}
