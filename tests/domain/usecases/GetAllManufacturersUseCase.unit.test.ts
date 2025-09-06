import { GetAllManufacturersUseCase } from '../../../src/domain/usecases/Manufacturer/GetAllManufacturersUseCase';
import { ManufacturerRepository } from '../../../src/domain/repositories/ManufacturerRepository';

describe('GetAllManufacturersUseCase', () => {
    it('debe retornar todos los manufacturers si no hay opciones', async () => {
        const mockRepo: Partial<ManufacturerRepository> = {
            findAll: jest.fn().mockResolvedValue([
                { id: 1, name: 'Sony' },
                { id: 2, name: 'LG' },
            ]),
        };
        const usecase = new GetAllManufacturersUseCase(mockRepo as ManufacturerRepository);
        const result = await usecase.execute();
        expect(result.data.length).toBe(2);
        expect(result.total).toBe(2);
        expect(result.current_page).toBe(1);
        expect(result.per_page).toBe(2);
        expect(result.last_page).toBe(1);
        expect(mockRepo.findAll).toHaveBeenCalled();
    });

    it('debe retornar manufacturers filtrados si hay opciones', async () => {
        const mockRepo: Partial<ManufacturerRepository> = {
            findByFilter: jest.fn().mockResolvedValue({
                total: 1,
                data: [{ id: 2, name: 'LG' }],
                current_page: 1,
                per_page: 10,
                last_page: 1,
            }),
        };
        const usecase = new GetAllManufacturersUseCase(mockRepo as ManufacturerRepository);
        const result = await usecase.execute({ name: 'LG', page: 1, per_page: 10 });
        expect(result.data[0].name).toBe('LG');
        expect(result.total).toBe(1);
        expect(mockRepo.findByFilter).toHaveBeenCalledWith({ name: 'LG', page: 1, per_page: 10 });
    });

    it('debe retornar vacío si no hay manufacturers', async () => {
        const mockRepo: Partial<ManufacturerRepository> = {
            findAll: jest.fn().mockResolvedValue([]),
        };
        const usecase = new GetAllManufacturersUseCase(mockRepo as ManufacturerRepository);
        const result = await usecase.execute();
        expect(result.data).toEqual([]);
        expect(result.total).toBe(0);
    });
});
