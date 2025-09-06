import { GetAllClientsUseCase } from '../../../src/domain/usecases/Client/GetAllClientsUseCase';
import { ClientRepository } from '../../../src/domain/repositories/ClientRepository';

describe('GetAllClientsUseCase', () => {
    it('debe retornar todos los clientes paginados', async () => {
        const mockRepo: Partial<ClientRepository> = {
            findAll: jest.fn().mockResolvedValue({
                data: [
                    { id: 1, name: 'Juan', phone: '809-000-0000', clientType: 'vip' },
                    { id: 2, name: 'Ana', phone: '809-111-1111', clientType: 'regular' },
                ],
                total: 2,
                page: 1,
                per_page: 10,
            }),
        };
        const usecase = new GetAllClientsUseCase(mockRepo as ClientRepository);
        const result = await usecase.execute({ page: 1, per_page: 10 });
        expect(result.data.length).toBe(2);
        expect(result.total).toBe(2);
        expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, per_page: 10 });
    });

    it('debe filtrar por nombre', async () => {
        const mockRepo: Partial<ClientRepository> = {
            findAll: jest.fn().mockResolvedValue({
                data: [{ id: 1, name: 'Juan', phone: '809-000-0000', clientType: 'vip' }],
                total: 1,
                page: 1,
                per_page: 10,
            }),
        };
        const usecase = new GetAllClientsUseCase(mockRepo as ClientRepository);
        const result = await usecase.execute({ nombre: 'Juan' });
        expect(result.data[0].name).toBe('Juan');
        expect(mockRepo.findAll).toHaveBeenCalledWith({ nombre: 'Juan' });
    });

    it('debe retornar vacío si no hay clientes', async () => {
        const mockRepo: Partial<ClientRepository> = {
            findAll: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, per_page: 10 }),
        };
        const usecase = new GetAllClientsUseCase(mockRepo as ClientRepository);
        const result = await usecase.execute();
        expect(result.data).toEqual([]);
        expect(result.total).toBe(0);
    });
});
