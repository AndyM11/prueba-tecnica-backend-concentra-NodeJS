import { PrismaLocationRepository } from '../../src/infrastructure/repositories/PrismaLocationRepository';
import { PrismaClient } from '@prisma/client';

// Unit tests for PrismaLocationRepository
describe('PrismaLocationRepository', () => {
    it('debe instanciar correctamente', () => {
        const repo = new PrismaLocationRepository(new PrismaClient());
        expect(repo).toBeInstanceOf(PrismaLocationRepository);
    });

    // ...implementar pruebas unitarias para métodos del repositorio, incluyendo getAll...
});
