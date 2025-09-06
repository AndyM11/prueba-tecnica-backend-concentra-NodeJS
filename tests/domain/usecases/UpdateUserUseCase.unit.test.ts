import { UpdateUserUseCase } from '../../../src/domain/usecases/User/UpdateUserUseCase';
import { UserRepository } from '../../../src/domain/repositories/UserRepository';
import { UserRole } from '../../../src/domain/entities/Types';

describe('UpdateUserUseCase', () => {
    it('actualiza usuario con datos válidos', async () => {
        const mockRepo: Partial<UserRepository> = {
            existsByUsername: jest.fn().mockResolvedValue(false),
            update: jest.fn().mockResolvedValue({
                id: 1,
                username: 'nuevo',
                passwordHash: 'hash',
                rol: UserRole.USER,
                employeeId: null,
            }),
        };
        const usecase = new UpdateUserUseCase(mockRepo as UserRepository);
        const result = await usecase.execute(1, { username: 'nuevo', password: 'Password123!', rol: UserRole.USER });
        expect(result).toHaveProperty('username', 'nuevo');
        expect(mockRepo.update).toHaveBeenCalled();
    });

    it('lanza error si la contraseña es débil', async () => {
        const mockRepo: Partial<UserRepository> = {
            existsByUsername: jest.fn().mockResolvedValue(false),
            update: jest.fn(),
        };
        const usecase = new UpdateUserUseCase(mockRepo as UserRepository);
        await expect(usecase.execute(1, { password: '123' })).rejects.toThrow('La contraseña no cumple con los requisitos de robustez.');
    });

    it('lanza error si el username ya existe', async () => {
        const mockRepo: Partial<UserRepository> = {
            existsByUsername: jest.fn().mockResolvedValue(true),
            update: jest.fn(),
        };
        const usecase = new UpdateUserUseCase(mockRepo as UserRepository);
        await expect(usecase.execute(1, { username: 'existente', password: 'Password123!' })).rejects.toThrow('El nombre de usuario ya existe.');
    });

    it('actualiza solo el rol y employeeId', async () => {
        const mockRepo: Partial<UserRepository> = {
            existsByUsername: jest.fn().mockResolvedValue(false),
            update: jest.fn().mockResolvedValue({
                id: 1,
                username: 'user',
                passwordHash: 'hash',
                rol: UserRole.ADMIN,
                employeeId: 2,
            }),
        };
        const usecase = new UpdateUserUseCase(mockRepo as UserRepository);
        const result = await usecase.execute(1, { rol: UserRole.ADMIN, employeeId: 2 });
        expect(result).toHaveProperty('rol', UserRole.ADMIN);
        expect(result).toHaveProperty('employeeId', 2);
    });

    it('devuelve null si el usuario no existe', async () => {
        const mockRepo: Partial<UserRepository> = {
            existsByUsername: jest.fn().mockResolvedValue(false),
            update: jest.fn().mockResolvedValue(null),
        };
        const usecase = new UpdateUserUseCase(mockRepo as UserRepository);
        const result = await usecase.execute(999, { username: 'noexiste', password: 'Password123!' });
        expect(result).toBeNull();
    });
});
