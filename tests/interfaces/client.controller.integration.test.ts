import { PrismaClient } from '@prisma/client';
import express from 'express';
import request from 'supertest';
import clientRoutes from '../../src/interfaces/routes/client.routes';

describe('ClientController (integration)', () => {
    let app: express.Express;
    let prisma: PrismaClient;

    beforeAll(async () => {
        prisma = new PrismaClient();
        await prisma.$connect();
        app = express();
        app.use(express.json());
        app.use('/api/v1/client', clientRoutes);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });


    beforeEach(async () => {
        // Limpiar la base de datos antes de cada test para máximo aislamiento
        await prisma.compra.deleteMany();   // Borra primero las compras (hija)
        await prisma.cliente.deleteMany();  // Luego los clientes (padre)
    });

    afterEach(async () => {
        // Limpiar también después por seguridad
        await prisma.compra.deleteMany();
        await prisma.cliente.deleteMany();
    });

    it('should create and get a real client in the database', async () => {
        const uniqueName = `Real_${Date.now()}`;
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: uniqueName, phone: '809-000-0000', clientType: 'vip' });
        expect(resCreate.status).toBe(201);
        const id = resCreate.body.id;
        // Verificar que el cliente existe en la base de datos
        const dbClient = await prisma.cliente.findUnique({ where: { id } });
        expect(dbClient).not.toBeNull();
        const resGet = await request(app)
            .get(`/api/v1/client/${id}`);
        expect(resGet.status).toBe(200);
        expect(resGet.body.name).toBe(uniqueName);
        expect(resGet.body.clientType).toBe('vip');
    });

    it('should update only the name of a client', async () => {
        const uniqueName = `Update_${Date.now()}`;
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: uniqueName, phone: '829-000-0000', clientType: 'regular' });
        const id = resCreate.body.id;
        const resUpdate = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ name: 'Actualizado' });
        expect([200, 204]).toContain(resUpdate.status);
        expect(resUpdate.body.name).toBe('Actualizado');
        expect(resUpdate.body.phone).toBe('829-000-0000');
        expect(resUpdate.body.clientType).toBe('regular');
    });

    it('should delete a client in the database', async () => {
        const uniqueName = `Delete_${Date.now()}`;
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: uniqueName, phone: '849-000-0000', clientType: 'vip' });
        const id = resCreate.body.id;
        const resDelete = await request(app)
            .delete(`/api/v1/client/${id}`);
        expect([204, 200]).toContain(resDelete.status);
        const resGet = await request(app)
            .get(`/api/v1/client/${id}`);
        expect(resGet.status).toBe(404);
    });

    it('should list paginated clients', async () => {
        const now = Date.now();
        await prisma.cliente.createMany({
            data: [
                { nombre: `A_${now}`, telefono: '809-111-1111', tipoCliente: 'regular' },
                { nombre: `B_${now}`, telefono: '829-222-2222', tipoCliente: 'vip' },
                { nombre: `C_${now}`, telefono: '849-333-3333', tipoCliente: 'regular' }
            ]
        });
        const resList = await request(app)
            .get('/api/v1/client?page=1&per_page=2');
        expect(resList.status).toBe(200);
        expect(resList.body.data.length).toBeLessThanOrEqual(2);
        expect(resList.body.total).toBeGreaterThanOrEqual(3);
        expect(resList.body.data[0]).toHaveProperty('name');
        expect(resList.body.data[0]).toHaveProperty('phone');
        expect(resList.body.data[0]).toHaveProperty('clientType');
    });

    it('should reject update with incorrect phone format', async () => {
        // Crear cliente válido primero
        const uniqueName = `Valido_${Date.now()}`;
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: uniqueName, phone: '809-123-4567', clientType: 'regular' });
        const id = resCreate.body.id;
        // Intentar actualizar con teléfono inválido
        const updateRes = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ phone: '123-456-7890' });
        expect(updateRes.status).toBe(400);
        expect(updateRes.body).toHaveProperty('error');
        expect(['Datos inválidos', 'El teléfono tiene un formato inválido', 'ID de cliente inválido']).toContain(updateRes.body.error);
    });
});
