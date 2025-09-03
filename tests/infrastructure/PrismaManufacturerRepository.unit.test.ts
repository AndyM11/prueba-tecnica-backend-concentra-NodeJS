import { PrismaManufacturerRepository } from '../../src/infrastructure/repositories/PrismaManufacturerRepository';

describe('PrismaManufacturerRepository', () => {
    it('findAll debería devolver un array', async () => {
        const repo = new PrismaManufacturerRepository();
        const result = await repo.findAll();
        expect(Array.isArray(result)).toBe(true);
    });
});
