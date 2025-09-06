
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../../src/domain/entities/Types';
import { PrismaUserRepository } from '../../src/infrastructure/repositories/PrismaUserRepository';

describe('PrismaUserRepository', () => {
    it('update retorna null si Prisma lanza error', async () => {
        (prisma.usuario.update as jest.Mock).mockRejectedValue(new Error('Prisma error'));
        const user = await repo.update(1, { username: 'error' });
        expect(user).toBeNull();
    });

    it('findById retorna null si no existe', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
        const user = await repo.findById(999);
        expect(user).toBeNull();
    });

    it('findByUsername retorna null si no existe', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
        const user = await repo.findByUsername('no-user');
        expect(user).toBeNull();
    });

    it('findAll retorna array vacío si no hay usuarios', async () => {
        (prisma.usuario.findMany as jest.Mock).mockResolvedValue([]);
        const users = await repo.findAll();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(0);
    });
    type MockUsuario = {
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        findUnique: jest.Mock;
        findMany: jest.Mock;
    };
    const prisma = {
        usuario: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        } as MockUsuario,
    } as unknown as PrismaClient;
    const repo = new PrismaUserRepository(prisma);

    beforeEach(() => jest.clearAllMocks());

    it('debe crear un usuario', async () => {
        (prisma.usuario.create as jest.Mock).mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, empleadoId: null });
        const user = await repo.create({ username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('username', 'user');
        expect(user).toHaveProperty('rol', UserRole.USER);
    });

    it('debe actualizar un usuario', async () => {
        (prisma.usuario.update as jest.Mock).mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, empleadoId: null });
        const user = await repo.update(1, { username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('username', 'user');
    });

    it('debe eliminar un usuario', async () => {
        (prisma.usuario.delete as jest.Mock).mockResolvedValue({});
        await repo.delete(1);
        expect(prisma.usuario.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe buscar usuario por id', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, empleadoId: null });
        const user = await repo.findById(1);
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('username', 'user');
    });

    it('debe buscar usuario por username', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, empleadoId: null });
        const user = await repo.findByUsername('user');
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('username', 'user');
    });

    it('debe obtener todos los usuarios', async () => {
        (prisma.usuario.findMany as jest.Mock).mockResolvedValue([{ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, empleadoId: null }]);
        const users = await repo.findAll();
        expect(Array.isArray(users)).toBe(true);
        expect(users[0]).toHaveProperty('id', 1);
    });

    it('debe verificar existencia de username', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
        const exists = await repo.existsByUsername('user');
        expect(exists).toBe(true);
    });

    it('debe retornar false si username no existe', async () => {
        (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
        const exists = await repo.existsByUsername('no-user');
        expect(exists).toBe(false);
    });
});
