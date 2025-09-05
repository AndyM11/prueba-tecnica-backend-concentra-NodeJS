import { CreateUserUseCase } from '../../src/domain/usecases/User/CreateUserUseCase';
import { UpdateUserUseCase } from '../../src/domain/usecases/User/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../src/domain/usecases/User/DeleteUserUseCase';
import { GetUserByIdUseCase } from '../../src/domain/usecases/User/GetUserByIdUseCase';
import { GetAllUsersUseCase } from '../../src/domain/usecases/User/GetAllUsersUseCase';
import { UserRole } from '../../src/domain/entities/Types';

describe('User Use Cases', () => {
    const mockRepo = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        existsByUsername: jest.fn(),
        findByUsername: jest.fn(),
    };

    beforeEach(() => jest.clearAllMocks());

    it('debe crear un usuario válido', async () => {
        const useCase = new CreateUserUseCase(mockRepo as any);
        mockRepo.existsByUsername.mockResolvedValue(false);
        mockRepo.create.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        const user = await useCase.execute({ username: 'user', password: 'Password123!', rol: UserRole.USER });
        expect(user).toHaveProperty('id');
        expect(mockRepo.create).toHaveBeenCalled();
    });

    it('no debe crear usuario con username repetido', async () => {
        const useCase = new CreateUserUseCase(mockRepo as any);
        mockRepo.existsByUsername.mockResolvedValue(true);
        await expect(useCase.execute({ username: 'user', password: 'Password123!', rol: UserRole.USER })).rejects.toThrow('El nombre de usuario ya existe.');
    });

    it('debe actualizar un usuario', async () => {
        const useCase = new UpdateUserUseCase(mockRepo as any);
        mockRepo.existsByUsername.mockResolvedValue(false);
        mockRepo.update.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        const user = await useCase.execute(1, { username: 'user', password: 'Password123!', rol: UserRole.USER });
        expect(user).toHaveProperty('id');
        expect(mockRepo.update).toHaveBeenCalled();
    });

    it('debe eliminar un usuario', async () => {
        const useCase = new DeleteUserUseCase(mockRepo as any);
        await useCase.execute(1);
        expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('debe obtener usuario por id', async () => {
        const useCase = new GetUserByIdUseCase(mockRepo as any);
        mockRepo.findById.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        const user = await useCase.execute(1);
        expect(user).toHaveProperty('id');
    });

    it('debe obtener todos los usuarios', async () => {
        const useCase = new GetAllUsersUseCase(mockRepo as any);
        mockRepo.findAll.mockResolvedValue([{ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null }]);
        const users = await useCase.execute();
        expect(Array.isArray(users)).toBe(true);
    });
});
