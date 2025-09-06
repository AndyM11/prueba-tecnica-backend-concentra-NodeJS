
import { PrismaPlacementRepository } from '../../src/infrastructure/repositories/PrismaPlacementRepository';
import { PrismaClient } from '@prisma/client';
import { Placement } from '../../src/domain/entities/Placement';

describe('PrismaPlacementRepository', () => {
    type MockColocacion = {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        delete: jest.Mock;
    };
    let prisma: { colocacion: MockColocacion };
    let repo: PrismaPlacementRepository;

    beforeEach(() => {
        prisma = {
            colocacion: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                delete: jest.fn(),
            },
        };
        repo = new PrismaPlacementRepository(prisma as unknown as PrismaClient);
    });

    it('findAll retorna array de Placement', async () => {
        prisma.colocacion.findMany.mockResolvedValue([
            { id: 1, articuloId: 1, ubicacionId: 2, nombreExhibido: 'Test', precio: 10 },
        ]);
        const result = await repo.findAll();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBeInstanceOf(Placement);
    });

    it('findById retorna Placement si existe', async () => {
        prisma.colocacion.findUnique.mockResolvedValue({ id: 1, articuloId: 1, ubicacionId: 2, nombreExhibido: 'Test', precio: 10 });
        const result = await repo.findById(1);
        expect(result).toBeInstanceOf(Placement);
        expect(result).toHaveProperty('id', 1);
    });

    it('findById retorna null si no existe', async () => {
        prisma.colocacion.findUnique.mockResolvedValue(null);
        const result = await repo.findById(999);
        expect(result).toBeNull();
    });

    it('create retorna nuevo Placement', async () => {
        prisma.colocacion.create.mockResolvedValue({ id: 2, articuloId: 1, ubicacionId: 2, nombreExhibido: 'Nuevo', precio: 20 });
        const result = await repo.create({ articleId: 1, locationId: 2, displayName: 'Nuevo', price: 20 });
        expect(result).toBeInstanceOf(Placement);
        expect(result).toHaveProperty('id', 2);
        expect(result).toHaveProperty('displayName', 'Nuevo');
    });

    it('delete elimina Placement', async () => {
        prisma.colocacion.delete.mockResolvedValue(undefined);
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });
});
