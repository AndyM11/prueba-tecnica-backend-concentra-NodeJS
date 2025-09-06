import { PrismaClientRepository } from '../../src/infrastructure/repositories/PrismaClientRepository';
import { PrismaClient } from '@prisma/client';
import { ClientType } from '../../src/domain/entities/Types';

describe('PrismaClientRepository', () => {
    it('findAll sin filtros retorna todos los clientes', async () => {
        prisma.cliente.findMany.mockResolvedValue([
            { id: 1, nombre: 'Juan', telefono: '809-123-4567', tipoCliente: 'regular' }
        ]);
        prisma.cliente.count.mockResolvedValue(1);
        const result = await repo.findAll();
        expect(result.total).toBe(1);
        expect(result.data[0]).toHaveProperty('name', 'Juan');
    });

    it('update retorna null si Prisma lanza error', async () => {
        prisma.cliente.update.mockRejectedValue(new Error('Prisma error'));
        const result = await repo.update(1, { name: 'Error' });
        expect(result).toBeNull();
    });

    it('findAll paginación avanzada', async () => {
        prisma.cliente.findMany.mockResolvedValue([
            { id: 3, nombre: 'Pag3', telefono: '809-000-0000', tipoCliente: 'vip' },
            { id: 4, nombre: 'Pag4', telefono: '809-111-1111', tipoCliente: 'regular' }
        ]);
        prisma.cliente.count.mockResolvedValue(4);
        const result = await repo.findAll({ page: 2, per_page: 2 });
        expect(result.page).toBe(2);
        expect(result.per_page).toBe(2);
        expect(result.data[0]).toHaveProperty('name', 'Pag3');
    });
    type MockCliente = {
        findUnique: jest.Mock;
        findMany: jest.Mock;
        count: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    let prisma: { cliente: MockCliente };
    let repo: PrismaClientRepository;

    beforeEach(() => {
        prisma = {
            cliente: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        repo = new PrismaClientRepository(prisma as unknown as PrismaClient);
    });

    it('findById retorna Client si existe', async () => {
        prisma.cliente.findUnique.mockResolvedValue({
            id: 1,
            nombre: 'Juan',
            telefono: '809-123-4567',
            tipoCliente: 'regular',
        });
        const result = await repo.findById(1);
        expect(result).toEqual({
            id: 1,
            name: 'Juan',
            phone: '809-123-4567',
            clientType: ClientType.REGULAR,
        });
    });

    it('findById retorna null si no existe', async () => {
        prisma.cliente.findUnique.mockResolvedValue(null);
        const result = await repo.findById(999);
        expect(result).toBeNull();
    });

    it('findAll retorna clientes paginados', async () => {
        prisma.cliente.findMany.mockResolvedValue([
            { id: 1, nombre: 'Juan', telefono: '809-123-4567', tipoCliente: 'regular' },
            { id: 2, nombre: 'Ana', telefono: '809-567-8901', tipoCliente: 'vip' },
        ]);
        prisma.cliente.count.mockResolvedValue(2);
        const result = await repo.findAll({ name: 'a', page: 1, per_page: 2 });
        expect(result.total).toBe(2);
        expect(result.data[0]).toHaveProperty('name', 'Juan');
        expect(result.data[1]).toHaveProperty('clientType', ClientType.VIP);
    });

    it('create retorna nuevo Client', async () => {
        prisma.cliente.create.mockResolvedValue({
            id: 3,
            nombre: 'Pedro',
            telefono: '809-345-6789',
            tipoCliente: 'regular',
        });
        const result = await repo.create({ name: 'Pedro', phone: '809-345-6789', clientType: ClientType.REGULAR });
        expect(result).toHaveProperty('id', 3);
        expect(result).toHaveProperty('name', 'Pedro');
        expect(result).toHaveProperty('clientType', ClientType.REGULAR);
    });

    it('update retorna Client actualizado', async () => {
        prisma.cliente.update.mockResolvedValue({
            id: 1,
            nombre: 'Juan Actualizado',
            telefono: '809-123-4567',
            tipoCliente: 'vip',
        });
        const result = await repo.update(1, { name: 'Juan Actualizado', clientType: ClientType.VIP });
        expect(result).toHaveProperty('name', 'Juan Actualizado');
        expect(result).toHaveProperty('clientType', ClientType.VIP);
    });

    it('delete elimina Client', async () => {
        prisma.cliente.delete.mockResolvedValue(undefined);
        await expect(repo.delete(1)).resolves.toBeUndefined();
    });
});
