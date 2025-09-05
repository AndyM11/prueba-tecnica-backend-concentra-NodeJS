import { CreateBuyUseCase } from '../../src/domain/usecases/Buy/CreateBuyUseCase';
import { UpdateBuyUseCase } from '../../src/domain/usecases/Buy/UpdateBuyUseCase';
import { DeleteBuyUseCase } from '../../src/domain/usecases/Buy/DeleteBuyUseCase';
import { GetBuyByIdUseCase } from '../../src/domain/usecases/Buy/GetBuyByIdUseCase';
import { GetAllBuysUseCase } from '../../src/domain/usecases/Buy/GetAllBuysUseCase';
import { Buy } from '../../src/domain/entities/Buy';

describe('Buy UseCases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    function getRepoMock() {
        return {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            findById: jest.fn().mockResolvedValue({ id: 1, clientId: 2, placementId: 3, units: 5 }),
            findByFilter: jest.fn().mockResolvedValue({ data: [{ id: 1, clientId: 2, placementId: 3, units: 5 }] }),
        };
    }

    it('should create a buy', async () => {
        const repoMock = getRepoMock();
        const useCase = new CreateBuyUseCase(repoMock as any);
        repoMock.create.mockResolvedValue({ id: 1, clientId: 2, placementId: 3, units: 5 });
        const result = await useCase.execute({ clientId: 2, placementId: 3, units: 5 });
        expect(result).toEqual({ id: 1, clientId: 2, placementId: 3, units: 5 });
        expect(repoMock.create).toHaveBeenCalled();
    });

    it('should update a buy', async () => {
        const repoMock = getRepoMock();
        const useCase = new UpdateBuyUseCase(repoMock as any);
        repoMock.update.mockResolvedValue({ id: 1, clientId: 2, placementId: 3, units: 10 });
        const result = await useCase.execute(1, { units: 10 });
        expect(result?.units).toBe(10);
        expect(repoMock.update).toHaveBeenCalled();
    });

    it('should delete a buy', async () => {
        const repoMock = getRepoMock();
        const useCase = new DeleteBuyUseCase(repoMock as any);
        repoMock.delete.mockResolvedValue(undefined);
        await expect(useCase.execute(1)).resolves.toBeUndefined();
        expect(repoMock.delete).toHaveBeenCalled();
    });

    it('should get buy by id', async () => {
        const repoMockLocal = getRepoMock();
        repoMockLocal.findById.mockResolvedValue({ id: 1, clientId: 2, placementId: 3, units: 5 });
        const useCase = new GetBuyByIdUseCase(repoMockLocal as any);
        const result = await useCase.execute(1);
        expect(result?.id).toBe(1);
        expect(repoMockLocal.findById).toHaveBeenCalled();
    });

    it('should get all buys', async () => {
        const repoMockLocal = getRepoMock();
        repoMockLocal.findByFilter.mockResolvedValue({ data: [{ id: 1, clientId: 2, placementId: 3, units: 5 }] });
        const useCase = new GetAllBuysUseCase(repoMockLocal as any);
        const result = await useCase.execute({});
        expect(result.data.length).toBeGreaterThan(0);
        expect(repoMockLocal.findByFilter).toHaveBeenCalled();
    });
});
