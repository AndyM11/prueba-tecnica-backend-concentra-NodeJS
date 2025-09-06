
import { PrismaArticleRepository } from '../../src/infrastructure/repositories/PrismaArticleRepository';
import { PrismaClient } from '@prisma/client';

describe('PrismaArticleRepository (infrastructure)', () => {
    type MockArticulo = {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    const prisma = {
        articulo: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as MockArticulo,
    } as unknown as PrismaClient;
    let repo: PrismaArticleRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repo = new PrismaArticleRepository(prisma);
    });

    it('getAll retorna artículos', async () => {
        (prisma.articulo.findMany as jest.Mock).mockResolvedValue([
            { id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' }
        ]);
        const result = await repo.getAll();
        expect(result[0]).toHaveProperty('barcode', '12345');
        expect(result[0]).toHaveProperty('manufacturerId', 1);
    });

    it('getById retorna artículo', async () => {
        (prisma.articulo.findUnique as jest.Mock).mockResolvedValue({ id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' });
        const result = await repo.getById(1);
        expect(result).toHaveProperty('barcode', '12345');
        expect(result).toHaveProperty('manufacturerId', 1);
    });

    it('getById retorna null si no existe', async () => {
        (prisma.articulo.findUnique as jest.Mock).mockResolvedValue(null);
        const result = await repo.getById(999);
        expect(result).toBeNull();
    });

    it('create retorna nuevo artículo', async () => {
        (prisma.articulo.create as jest.Mock).mockResolvedValue({ id: 1, codigoBarras: '12345', fabricanteId: 1, stock: 0, descripcion: 'desc' });
        const result = await repo.create({ barcode: '12345', manufacturerId: 1 });
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('barcode', '12345');
    });

    it('update retorna artículo actualizado', async () => {
        (prisma.articulo.update as jest.Mock).mockResolvedValue({ id: 1, codigoBarras: '54321', fabricanteId: 1, stock: 0, descripcion: 'desc' });
        // Suponiendo que el método update existe en el repo
        const result = await repo.update(1, { barcode: '54321' });
        expect(result).toHaveProperty('barcode', '54321');
    });

    it('delete elimina artículo', async () => {
        (prisma.articulo.delete as jest.Mock).mockResolvedValue(undefined);
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });
});
