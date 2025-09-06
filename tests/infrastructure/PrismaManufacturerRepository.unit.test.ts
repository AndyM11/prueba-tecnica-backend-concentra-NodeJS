

import { PrismaManufacturerRepository } from '../../src/infrastructure/repositories/PrismaManufacturerRepository';
import { PrismaClient } from '@prisma/client';
import { Manufacturer } from '../../src/domain/entities/Manufacturer';

describe('PrismaManufacturerRepository', () => {
    it('findByFilter con per_page=0 no divide por cero', async () => {
        prisma.fabricante.count.mockResolvedValue(5);
        prisma.fabricante.findMany.mockResolvedValue([]);
        const result = await repo.findByFilter({ page: 1, per_page: 0 });
        expect(result.last_page).toBe(Infinity);
        expect(result.data).toHaveLength(0);
    });
    it('create lanza error de Prisma', async () => {
        prisma.fabricante.create.mockRejectedValue(new Error('Prisma error'));
        await expect(repo.create('Error')).rejects.toThrow('Prisma error');
    });

    it('update lanza error de Prisma', async () => {
        prisma.fabricante.update.mockRejectedValue(new Error('Prisma error'));
        await expect(repo.update(1, 'Error')).rejects.toThrow('Prisma error');
    });

    it('delete lanza error de Prisma', async () => {
        prisma.fabricante.delete.mockRejectedValue(new Error('Prisma error'));
        await expect(repo.delete(1)).rejects.toThrow('Prisma error');
    });
    type MockFabricante = {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        count: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    let prisma: { fabricante: MockFabricante };
    let repo: PrismaManufacturerRepository;

    beforeEach(() => {
        prisma = {
            fabricante: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                count: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        // Forzamos el tipado porque solo usamos el campo necesario para el repo
        repo = new PrismaManufacturerRepository(prisma as unknown as PrismaClient);
    });

    it('findAll retorna instancias Manufacturer', async () => {
        prisma.fabricante.findMany.mockResolvedValue([
            { id: 1, nombre: 'Fabricante A' },
            { id: 2, nombre: 'Fabricante B' }
        ]);
        const result = await repo.findAll();
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(Manufacturer);
        expect(result[0]).toHaveProperty('id', 1);
        expect(result[0]).toHaveProperty('name', 'Fabricante A');
    });

    it('findById retorna Manufacturer si existe', async () => {
        prisma.fabricante.findUnique.mockResolvedValue({ id: 1, nombre: 'Fabricante A' });
        const result = await repo.findById(1);
        expect(result).toBeInstanceOf(Manufacturer);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name', 'Fabricante A');
    });

    it('findById retorna null si no existe', async () => {
        prisma.fabricante.findUnique.mockResolvedValue(null);
        const result = await repo.findById(999);
        expect(result).toBeNull();
    });

    it('create retorna nuevo Manufacturer', async () => {
        prisma.fabricante.create.mockResolvedValue({ id: 3, nombre: 'Nuevo' });
        const result = await repo.create('Nuevo');
        expect(result).toBeInstanceOf(Manufacturer);
        expect(result).toHaveProperty('id', 3);
        expect(result).toHaveProperty('name', 'Nuevo');
    });

    it('update retorna Manufacturer actualizado', async () => {
        prisma.fabricante.update.mockResolvedValue({ id: 1, nombre: 'Actualizado' });
        const result = await repo.update(1, 'Actualizado');
        expect(result).toBeInstanceOf(Manufacturer);
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name', 'Actualizado');
    });

    it('delete elimina Manufacturer', async () => {
        prisma.fabricante.delete.mockResolvedValue(undefined);
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });

    it('findByFilter retorna paginado', async () => {
        prisma.fabricante.count.mockResolvedValue(2);
        prisma.fabricante.findMany.mockResolvedValue([
            { id: 1, nombre: 'Fabricante A' },
            { id: 2, nombre: 'Fabricante B' }
        ]);
        const result = await repo.findByFilter({ name: 'A', page: 1, per_page: 2 });
        expect(result).toHaveProperty('total', 2);
        expect(result.data[0]).toBeInstanceOf(Manufacturer);
        expect(result.data[0]).toHaveProperty('name', 'Fabricante A');
    });

    it('findByFilter sin filtro name', async () => {
        prisma.fabricante.count.mockResolvedValue(1);
        prisma.fabricante.findMany.mockResolvedValue([
            { id: 3, nombre: 'SinFiltro' }
        ]);
        const result = await repo.findByFilter({ page: 1, per_page: 1 });
        expect(result.total).toBe(1);
        expect(result.data[0]).toHaveProperty('name', 'SinFiltro');
    });

    it('findByFilter retorna vacío si no hay resultados', async () => {
        prisma.fabricante.count.mockResolvedValue(0);
        prisma.fabricante.findMany.mockResolvedValue([]);
        const result = await repo.findByFilter({ name: 'NoExiste', page: 1, per_page: 2 });
        expect(result.total).toBe(0);
        expect(result.data).toHaveLength(0);
        expect(result.last_page).toBe(0);
    });

    it('findByFilter paginación avanzada', async () => {
        prisma.fabricante.count.mockResolvedValue(5);
        prisma.fabricante.findMany.mockResolvedValue([
            { id: 4, nombre: 'Pag4' },
            { id: 5, nombre: 'Pag5' }
        ]);
        const result = await repo.findByFilter({ page: 3, per_page: 2 });
        expect(result.current_page).toBe(3);
        expect(result.per_page).toBe(2);
        expect(result.last_page).toBe(3);
        expect(result.data[0]).toHaveProperty('name', 'Pag4');
    });
});
