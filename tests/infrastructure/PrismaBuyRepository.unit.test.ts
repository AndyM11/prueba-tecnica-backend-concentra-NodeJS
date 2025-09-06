import { PrismaBuyRepository } from '../../src/infrastructure/repositories/PrismaBuyRepository';
import { PrismaClient } from '@prisma/client';
import { Buy } from '../../src/domain/entities/Buy';

describe('PrismaBuyRepository', () => {
    type MockCompra = {
        create: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        findMany: jest.Mock;
        count: jest.Mock;
        delete: jest.Mock;
    };
    let prisma: { compra: MockCompra };
    let repo: PrismaBuyRepository;

    beforeEach(() => {
        prisma = {
            compra: {
                create: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                delete: jest.fn(),
            },
        };
        repo = new PrismaBuyRepository(prisma as unknown as PrismaClient);
    });

    it('create retorna nuevo Buy', async () => {
        prisma.compra.create.mockResolvedValue({ id: 1, clienteId: 2, colocacionId: 3, unidades: 5 });
        const buy: Buy = { id: 1, clientId: 2, placementId: 3, units: 5 };
        const result = await repo.create(buy);
        expect(result).toMatchObject({ id: 1, clientId: 2, placementId: 3, units: 5 });
    });

    it('getById retorna Buy si existe', async () => {
        prisma.compra.findUnique.mockResolvedValue({ id: 2, clienteId: 3, colocacionId: 4, unidades: 6 });
        const result = await repo.getById(2);
        expect(result).toMatchObject({ id: 2, clientId: 3, placementId: 4, units: 6 });
    });

    it('getById retorna null si no existe', async () => {
        prisma.compra.findUnique.mockResolvedValue(null);
        const result = await repo.getById(999);
        expect(result).toBeNull();
    });

    it('update retorna Buy actualizado', async () => {
        prisma.compra.update.mockResolvedValue({ id: 3, clienteId: 4, colocacionId: 5, unidades: 20 });
        const result = await repo.update(3, { units: 20 });
        expect(result).toMatchObject({ id: 3, units: 20 });
    });

    it('findByFilter retorna paginado', async () => {
        prisma.compra.findMany.mockResolvedValue([
            { id: 4, clienteId: 5, colocacionId: 6, unidades: 7 },
        ]);
        prisma.compra.count.mockResolvedValue(1);
        const result = await repo.findByFilter({ clientId: 5, page: 1, per_page: 1 });
        expect(result.total).toBe(1);
        expect(result.data[0]).toMatchObject({ clientId: 5 });
    });
    ;

    it('should delete a buy', async () => {
        prisma.compra.delete.mockResolvedValue({});
        prisma.compra.findUnique.mockResolvedValue(null);
        await expect(repo.delete(9999)).resolves.toBeUndefined();
        const result = await repo.getById(9999);
        expect(result).toBeNull();
    });
});
