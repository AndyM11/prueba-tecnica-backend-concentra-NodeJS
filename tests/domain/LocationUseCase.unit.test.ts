import { GetAllLocationsUseCase } from '../../src/domain/usecases/Location/GetAllLocationsUseCase';
import { LocationRepository } from '../../src/domain/repositories/LocationRepository';

// Unit tests for Location use cases
// ...implementar pruebas unitarias para cada caso de uso, incluyendo getAll...

describe('LocationUseCase', () => {
    it('debe instanciar GetAllLocationsUseCase correctamente', () => {
        const repo: LocationRepository = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        const usecase = new GetAllLocationsUseCase(repo);
        expect(usecase).toBeInstanceOf(GetAllLocationsUseCase);
    });
});
