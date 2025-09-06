import { UpdateClientUseCase } from '../../../src/domain/usecases/Client/UpdateClientUseCase';
import { Client, ClientType } from '../../../src/domain/entities/Client';

describe('UpdateClientUseCase', () => {
    const mockRepo = {
        update: jest.fn()
    };
    const useCase = new UpdateClientUseCase(mockRepo as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update client with valid data', async () => {
        const client: Client = {
            id: 1,
            name: 'Test',
            phone: '809-000-0000',
            clientType: ClientType.REGULAR
        };
        mockRepo.update.mockResolvedValue(client);
        const result = await useCase.execute(1, { name: 'Test', clientType: ClientType.REGULAR });
        expect(mockRepo.update).toHaveBeenCalledWith(1, { name: 'Test', clientType: ClientType.REGULAR });
        expect(result).toBe(client);
    });

    it('should throw error if clientType is invalid', async () => {
        await expect(
            useCase.execute(1, { clientType: 'invalid' as any })
        ).rejects.toThrow('Invalid clientType');
        expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('should allow update if clientType is omitted', async () => {
        mockRepo.update.mockResolvedValue({ id: 1, name: 'Test', phone: '809-000-0000', clientType: ClientType.REGULAR });
        await expect(useCase.execute(1, { name: 'Test' })).resolves.toBeTruthy();
    });

    it('should return null if repository returns null', async () => {
        mockRepo.update.mockResolvedValue(null);
        const result = await useCase.execute(1, { name: 'Test' });
        expect(result).toBeNull();
    });
});
