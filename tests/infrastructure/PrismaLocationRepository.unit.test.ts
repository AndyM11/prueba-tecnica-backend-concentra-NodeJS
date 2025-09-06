
import { PrismaLocationRepository } from '../../src/infrastructure/repositories/PrismaLocationRepository';
import { PrismaClient } from '@prisma/client';
import { Location } from '../../src/domain/entities/Location';

describe('PrismaLocationRepository', () => {
    type MockUbicacion = {
        create: jest.Mock;
        findUnique: jest.Mock;
        findMany: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    let prisma: { ubicacion: MockUbicacion };
    let repo: PrismaLocationRepository;

    beforeEach(() => {
        prisma = {
            ubicacion: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        repo = new PrismaLocationRepository(prisma as unknown as PrismaClient);
    });

    it('create retorna nueva Location', async () => {
        prisma.ubicacion.create.mockResolvedValue({ id: 1, nombre: 'TestLoc' });
        const result = await repo.create({ name: 'TestLoc' });
        expect(result).toBeInstanceOf(Location);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name', 'TestLoc');
    });

    it('getById retorna Location si existe', async () => {
        prisma.ubicacion.findUnique.mockResolvedValue({ id: 2, nombre: 'Loc2' });
        const result = await repo.getById(2);
        expect(result).toBeInstanceOf(Location);
        expect(result).toHaveProperty('id', 2);
    });

    it('getById retorna null si no existe', async () => {
        prisma.ubicacion.findUnique.mockResolvedValue(null);
        const result = await repo.getById(999);
        expect(result).toBeNull();
    });

    it('getAll retorna array de Location', async () => {
        prisma.ubicacion.findMany.mockResolvedValue([
            { id: 1, nombre: 'Loc1' },
            { id: 2, nombre: 'Loc2' },
        ]);
        const result = await repo.getAll();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBeInstanceOf(Location);
    });

    it('update retorna Location actualizada', async () => {
        prisma.ubicacion.update.mockResolvedValue({ id: 3, nombre: 'LocUpdated' });
        const result = await repo.update(3, { name: 'LocUpdated' });
        expect(result).toBeInstanceOf(Location);
        expect(result).toHaveProperty('name', 'LocUpdated');
    });

    it('delete elimina Location', async () => {
        prisma.ubicacion.delete.mockResolvedValue(undefined);
        await expect(repo.delete(4)).resolves.toBeUndefined();
    });
});
