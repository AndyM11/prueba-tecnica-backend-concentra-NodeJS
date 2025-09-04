import { PrismaPlacementRepository } from '../../src/infrastructure/repositories/PrismaPlacementRepository';
import { PrismaClient } from '@prisma/client';

describe('PrismaPlacementRepository', () => {
    const repo = new PrismaPlacementRepository();
    const prisma = new PrismaClient();
    let articuloId: number;
    let ubicacionId: number;
    // Generar valores únicos para cada ejecución
    const uniqueSuffix = Date.now();
    const testBarcode = `TESTPLACEMENT_${uniqueSuffix}`;
    const testLocation = `UbicacionTest_${uniqueSuffix}`;

    beforeAll(async () => {
        // Eliminar registros previos si existen
        await prisma.colocacion.deleteMany({ where: { articuloId } });
        await prisma.colocacion.deleteMany({ where: { ubicacionId } });
        await prisma.articulo.deleteMany({ where: { codigoBarras: testBarcode } });
        await prisma.ubicacion.deleteMany({ where: { nombre: testLocation } });
        // Crear artículo y ubicación válidos
        const articulo = await prisma.articulo.create({ data: { codigoBarras: testBarcode, fabricanteId: 1 } });
        articuloId = articulo.id;
        const ubicacion = await prisma.ubicacion.create({ data: { nombre: testLocation } });
        ubicacionId = ubicacion.id;
    });

    afterAll(async () => {
        // Eliminar colocaciones relacionadas primero para evitar errores de clave foránea
        await prisma.colocacion.deleteMany({ where: { articuloId } });
        await prisma.colocacion.deleteMany({ where: { ubicacionId } });
        await prisma.articulo.deleteMany({ where: { id: articuloId } });
        await prisma.ubicacion.deleteMany({ where: { id: ubicacionId } });
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
        const placement = await repo.create({ articuloId, ubicacionId, nombreExhibido: `Test_${uniqueSuffix}`, precio: 10 });
        expect(placement).toHaveProperty('id');
        const found = await repo.findById(placement.id);
        expect(found).not.toBeNull();
        expect(found?.nombreExhibido).toBe(`Test_${uniqueSuffix}`);
        // Limpieza
        await repo.delete(placement.id);
    });
});
