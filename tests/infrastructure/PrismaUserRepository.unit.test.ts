import { PrismaUserRepository } from '../../src/infrastructure/repositories/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../../src/domain/entities/Types';

describe('PrismaUserRepository', () => {
    const prisma = {
        usuario: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    } as any;
    const repo = new PrismaUserRepository(prisma as PrismaClient);

    beforeEach(() => jest.clearAllMocks());

    it('debe crear un usuario', async () => {
        prisma.usuario.create.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: 'USER', empleadoId: null });
        const user = await repo.create({ username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        expect(user).toHaveProperty('id');
    });

    it('debe actualizar un usuario', async () => {
        prisma.usuario.update.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: 'USER', empleadoId: null });
        const user = await repo.update(1, { username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        expect(user).toHaveProperty('id');
    });

    it('debe eliminar un usuario', async () => {
        prisma.usuario.delete.mockResolvedValue({});
        await repo.delete(1);
        expect(prisma.usuario.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe buscar usuario por id', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: 'USER', empleadoId: null });
        const user = await repo.findById(1);
        expect(user).toHaveProperty('id');
    });

    it('debe buscar usuario por username', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: 'USER', empleadoId: null });
        const user = await repo.findByUsername('user');
        expect(user).toHaveProperty('id');
    });

    it('debe obtener todos los usuarios', async () => {
        prisma.usuario.findMany.mockResolvedValue([{ id: 1, username: 'user', passwordHash: 'hash', rol: 'USER', empleadoId: null }]);
        const users = await repo.findAll();
        expect(Array.isArray(users)).toBe(true);
    });

    it('debe verificar existencia de username', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
        const exists = await repo.existsByUsername('user');
        expect(exists).toBe(true);
    });
});
