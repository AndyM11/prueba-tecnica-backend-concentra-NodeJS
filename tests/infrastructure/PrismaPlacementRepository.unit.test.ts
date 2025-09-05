import { PrismaPlacementRepository } from '../../src/infrastructure/repositories/PrismaPlacementRepository';
import { PrismaClient } from '@prisma/client';

describe('PrismaPlacementRepository', () => {
    const repo = new PrismaPlacementRepository();
    const prisma = new PrismaClient();
    let articleId: number;
    let locationId: number;
    // Generar valores únicos para cada ejecución
    const uniqueSuffix = Date.now();
    const testBarcode = `TESTPLACEMENT_${uniqueSuffix}`;
    const testLocation = `LocationTest_${uniqueSuffix}`;

    beforeAll(async () => {
        // Eliminar registros previos si existen
        await prisma.colocacion.deleteMany({ where: { articuloId: articleId } });
        await prisma.colocacion.deleteMany({ where: { ubicacionId: locationId } });
        await prisma.articulo.deleteMany({ where: { codigoBarras: testBarcode } });
        await prisma.ubicacion.deleteMany({ where: { nombre: testLocation } });
        await prisma.fabricante.deleteMany({ where: { nombre: `FabricanteTest_${uniqueSuffix}` } });
        // Crear fabricante válido y obtener su ID
        const fabricante = await prisma.fabricante.create({ data: { nombre: `FabricanteTest_${uniqueSuffix}` } });
        const fabricanteId = fabricante.id;
        // Crear artículo y ubicación válidos
        const articulo = await prisma.articulo.create({ data: { codigoBarras: testBarcode, fabricanteId } });
        articleId = articulo.id;
        const ubicacion = await prisma.ubicacion.create({ data: { nombre: testLocation } });
        locationId = ubicacion.id;
    });

    afterAll(async () => {
        // Eliminar colocaciones relacionadas primero para evitar errores de clave foránea
        await prisma.colocacion.deleteMany({ where: { articuloId: articleId } });
        await prisma.colocacion.deleteMany({ where: { ubicacionId: locationId } });
        await prisma.articulo.deleteMany({ where: { id: articleId } });
        await prisma.ubicacion.deleteMany({ where: { id: locationId } });
        await prisma.$disconnect();
    });

    it('findByFilter debería devolver datos paginados y filtrados', async () => {
        const result = await repo.findByFilter({ page: 1, per_page: 2 });
        expect(result).toHaveProperty('data');
        expect(Array.isArray(result.data)).toBe(true);
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('page', 1);
        expect(result).toHaveProperty('per_page', 2);
    });

    it('create y findById deberían crear y devolver un placement', async () => {
        const placement = await repo.create({ articleId, locationId, displayName: `Test_${uniqueSuffix}`, price: 10 });
        expect(placement).toHaveProperty('id');
        const found = await repo.findById(placement.id);
        expect(found).not.toBeNull();
        expect(found?.displayName).toBe(`Test_${uniqueSuffix}`);
        // Limpieza
        await repo.delete(placement.id);
    });
});
