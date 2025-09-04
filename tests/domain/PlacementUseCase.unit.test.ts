import { GetAllPlacementsUseCase } from '../../src/domain/usecases/Placement/GetAllPlacementsUseCase';
import { Placement } from '../../src/domain/entities/Placement';

describe('GetAllPlacementsUseCase', () => {
    it('debería devolver los placements filtrados y paginados', async () => {
        const mockRepo = {
            findByFilter: async (options: any) => ({
                total: 2,
                data: [
                    new Placement(1, 1, 1, 'Exhibido1', 10),
                    new Placement(2, 2, 1, 'Exhibido2', 20)
                ],
                page: 1,
                per_page: 2
            })
        };
        const useCase = new GetAllPlacementsUseCase(mockRepo as any);
        const result = await useCase.execute({ locationId: 1, page: 1, per_page: 2 });
        expect(result.data.length).toBe(2);
        expect(result.total).toBe(2);
        expect(result.page).toBe(1);
        expect(result.per_page).toBe(2);
    });
});
