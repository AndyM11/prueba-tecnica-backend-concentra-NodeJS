
import { PrismaPlacementRepository } from '../../src/infrastructure/repositories/PrismaPlacementRepository';
import { PrismaClient } from '@prisma/client';
import { Placement } from '../../src/domain/entities/Placement';

describe('PrismaPlacementRepository', () => {
    type MockColocacion = {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        delete: jest.Mock;
        update: jest.Mock;
        count: jest.Mock;
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
                update: jest.fn(),
                count: jest.fn(),
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

    describe('update', () => {
        it('actualiza todos los campos', async () => {
            prisma.colocacion.update.mockResolvedValue({
                id: 1,
                articuloId: 2,
                ubicacionId: 3,
                nombreExhibido: 'Actualizado',
                precio: 99
            });
            const result = await repo.update(1, { articleId: 2, locationId: 3, displayName: 'Actualizado', price: 99 });
            expect(result).toBeInstanceOf(Placement);
            expect(result).toHaveProperty('displayName', 'Actualizado');
        });

        it('actualiza solo un campo', async () => {
            prisma.colocacion.update.mockResolvedValue({
                id: 1,
                articuloId: 1,
                ubicacionId: 2,
                nombreExhibido: 'SoloNombre',
                precio: 10
            });
            const result = await repo.update(1, { displayName: 'SoloNombre' });
            expect(result).toBeInstanceOf(Placement);
            expect(result).toHaveProperty('displayName', 'SoloNombre');
        });
    });

    describe('findByFilter', () => {
        it('devuelve datos filtrando por articleId', async () => {
            prisma.colocacion.count.mockResolvedValue(1);
            prisma.colocacion.findMany.mockResolvedValue([
                { id: 1, articuloId: 2, ubicacionId: 3, nombreExhibido: 'Filtro', precio: 50 }
            ]);
            const result = await repo.findByFilter({ articleId: 2 });
            expect(result.data.length).toBe(1);
            expect(result.data[0]).toBeInstanceOf(Placement);
            expect(result.total).toBe(1);
        });

        it('devuelve datos filtrando por locationId y displayName', async () => {
            prisma.colocacion.count.mockResolvedValue(1);
            prisma.colocacion.findMany.mockResolvedValue([
                { id: 2, articuloId: 1, ubicacionId: 5, nombreExhibido: 'Nombre', precio: 20 }
            ]);
            const result = await repo.findByFilter({ locationId: 5, displayName: 'Nom' });
            expect(result.data.length).toBe(1);
            expect(result.data[0]).toBeInstanceOf(Placement);
            expect(result.total).toBe(1);
        });

        it('devuelve datos paginados', async () => {
            prisma.colocacion.count.mockResolvedValue(3);
            prisma.colocacion.findMany.mockResolvedValue([
                { id: 3, articuloId: 1, ubicacionId: 2, nombreExhibido: 'Pag1', precio: 10 },
                { id: 4, articuloId: 1, ubicacionId: 2, nombreExhibido: 'Pag2', precio: 20 }
            ]);
            const result = await repo.findByFilter({ page: 2, per_page: 2 });
            expect(result.page).toBe(2);
            expect(result.per_page).toBe(2);
            expect(result.data.length).toBe(2);
        });

        it('devuelve datos sin filtros', async () => {
            prisma.colocacion.count.mockResolvedValue(1);
            prisma.colocacion.findMany.mockResolvedValue([
                { id: 5, articuloId: 1, ubicacionId: 2, nombreExhibido: 'SinFiltro', precio: 10 }
            ]);
            const result = await repo.findByFilter();
            expect(result.data.length).toBe(1);
            expect(result.data[0]).toBeInstanceOf(Placement);
        });
    });
});
