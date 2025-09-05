import { PrismaBuyRepository } from '../../src/infrastructure/repositories/PrismaBuyRepository';
import { PrismaClient } from '@prisma/client';
import { Buy } from '../../src/domain/entities/Buy';

describe('PrismaBuyRepository', () => {
    let repo: PrismaBuyRepository;
    let prisma: PrismaClient;


    beforeAll(async () => {
        prisma = new PrismaClient();
        repo = new PrismaBuyRepository(prisma);
        // Eliminar datos previos en orden correcto para evitar conflictos de integridad
        await prisma.compra.deleteMany({});
        await prisma.colocacion.deleteMany({});
        await prisma.articulo.deleteMany({});
        await prisma.ubicacion.deleteMany({});
        await prisma.fabricante.deleteMany({});
        await prisma.cliente.deleteMany({});
        // Crear datos dependientes para Colocacion
        await prisma.fabricante.create({ data: { id: 1, nombre: 'TestFabricante' } });
        await prisma.articulo.create({ data: { id: 1, codigoBarras: 'ABC123', descripcion: 'TestArticulo', fabricanteId: 1, stock: 100 } });
        await prisma.ubicacion.create({ data: { id: 1, nombre: 'TestUbicacion' } });
        await prisma.cliente.create({ data: { id: 1, nombre: 'Test', telefono: '123456789', tipoCliente: 'Normal' } });
        await prisma.colocacion.create({ data: { id: 1, nombreExhibido: 'TestPlacement', precio: 10, ubicacionId: 1, articuloId: 1 } });
    });

    afterAll(async () => {
        // Limpiar datos creados
        // Eliminar en orden correcto para evitar errores de integridad
        await prisma.compra.deleteMany({});
        await prisma.colocacion.deleteMany({});
        await prisma.articulo.deleteMany({});
        await prisma.ubicacion.deleteMany({});
        await prisma.fabricante.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.$disconnect();
    });

    it('should create a buy', async () => {
        const buy: Buy = { id: 9999, clientId: 1, placementId: 1, units: 10 };
        const result = await repo.create(buy);
        expect(result).toMatchObject({ clientId: 1, placementId: 1, units: 10 });
    });

    it('should get buy by id', async () => {
        const result = await repo.getById(9999);
        expect(result?.id).toBe(9999);
    });

    it('should update a buy', async () => {
        const result = await repo.update(9999, { units: 20 });
        expect(result?.units).toBe(20);
    });

    it('should get all buys', async () => {
        const result = await repo.getAll({ clientId: 1 });
        expect(Array.isArray(result)).toBe(true);
    });

    it('should delete a buy', async () => {
        await expect(repo.delete(9999)).resolves.toBeUndefined();
        const result = await repo.getById(9999);
        expect(result).toBeNull();
    });
});
