import { PrismaArticleRepository } from '../../src/infrastructure/repositories/PrismaArticleRepository';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');
const prismaMock = new PrismaClient() as any;

let repo: PrismaArticleRepository;

describe('PrismaArticleRepository (infrastructure)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        repo = new PrismaArticleRepository(prismaMock);
    });

    it('getAll returns articles', async () => {
        prismaMock.articulo = { findMany: jest.fn().mockResolvedValue([{ id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' }]) };
        const result = await repo.getAll();
        expect(result[0]).toHaveProperty('barcode', '12345');
    });

    it('getById returns article', async () => {
        prismaMock.articulo = { findUnique: jest.fn().mockResolvedValue({ id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' }) };
        const result = await repo.getById(1);
        expect(result).toHaveProperty('barcode', '12345');
    });

    it('create returns new article', async () => {
        prismaMock.articulo = { create: jest.fn().mockResolvedValue({ id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' }) };
        const result = await repo.create({ barcode: '12345', manufacturerId: 1 });
        expect(result).toHaveProperty('id', 1);
    });

    it('update returns updated article', async () => {
        prismaMock.articulo = { update: jest.fn().mockResolvedValue({ id: 1, codigoBarras: '54321', fabricanteId: 1, stock: 0, descripcion: 'desc' }) };
        const result = await repo.update(1, { barcode: '54321' });
        expect(result).toHaveProperty('barcode', '54321');
    });

    it('delete removes article', async () => {
        prismaMock.articulo = { delete: jest.fn().mockResolvedValue(undefined) };
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });
});
