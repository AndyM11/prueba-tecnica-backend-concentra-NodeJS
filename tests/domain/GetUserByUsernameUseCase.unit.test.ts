import { GetUserByUsernameUseCase } from '../../src/domain/usecases/User/GetUserByUsernameUseCase';
import { UserRole } from '../../src/domain/entities/Types';

describe('GetUserByUsernameUseCase', () => {
    const mockRepo = {
        findByUsername: jest.fn(),
    };

    it('debe retornar el usuario si existe', async () => {
        const useCase = new GetUserByUsernameUseCase(mockRepo as any);
        mockRepo.findByUsername.mockResolvedValue({ id: 1, username: 'user', passwordHash: 'hash', rol: UserRole.USER, employeeId: null });
        const user = await useCase.execute('user');
        expect(user).toHaveProperty('id');
        expect(mockRepo.findByUsername).toHaveBeenCalledWith('user');
    });

    it('debe retornar null si no existe', async () => {
        const useCase = new GetUserByUsernameUseCase(mockRepo as any);
        mockRepo.findByUsername.mockResolvedValue(null);
        const user = await useCase.execute('noexiste');
        expect(user).toBeNull();
    });
});
