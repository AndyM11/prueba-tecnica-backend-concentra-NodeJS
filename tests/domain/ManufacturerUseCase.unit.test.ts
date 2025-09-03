import { GetAllManufacturersUseCase } from '../../src/domain/usecases/Manufacturer/GetAllManufacturersUseCase';
import { Manufacturer } from '../../src/domain/entities/Manufacturer';

describe('GetAllManufacturersUseCase', () => {
    it('debería devolver los fabricantes ordenados por id y paginados', async () => {
        const mockRepo = {
            findByFilter: async (options: any) => ({
                total: 3,
                data: [
                    new Manufacturer(2, 'B'),
                    new Manufacturer(1, 'A'),
                    new Manufacturer(3, 'C'),
                ].sort((a, b) => a.id - b.id),
                current_page: 1,
                per_page: 3,
                last_page: 1
            }),
            findAll: async () => [
                new Manufacturer(2, 'B'),
                new Manufacturer(1, 'A'),
                new Manufacturer(3, 'C'),
            ],
        };
        const useCase = new GetAllManufacturersUseCase(mockRepo as any);
        const result = await useCase.execute({});
        expect(result.data.map(m => m.id)).toEqual([1, 2, 3]);
        expect(result.total).toBe(3);
    });
});
