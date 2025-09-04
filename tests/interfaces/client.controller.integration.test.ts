import request from 'supertest';
import express from 'express';
import clientRoutes from '../../src/interfaces/routes/client.routes';
import { PrismaClient } from '@prisma/client';

describe('ClientController (integración)', () => {
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

    afterEach(async () => {
        await prisma.cliente.deleteMany();
    });

    it('debe crear y obtener un cliente real en la base de datos', async () => {
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Real', phone: '809-000-0000', clientType: 'vip' });
        expect(resCreate.status).toBe(201);
        const id = resCreate.body.id;
        const resGet = await request(app)
            .get(`/api/v1/client/${id}`);
        expect(resGet.status).toBe(200);
        expect(resGet.body.name).toBe('Real');
        expect(resGet.body.clientType).toBe('vip');
    });

    it('debe actualizar solo el nombre de un cliente', async () => {
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Update', phone: '829-000-0000', clientType: 'regular' });
        const id = resCreate.body.id;
        const resUpdate = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ name: 'Actualizado' });
        expect([200, 204]).toContain(resUpdate.status);
        expect(resUpdate.body.name).toBe('Actualizado');
        expect(resUpdate.body.phone).toBe('829-000-0000');
        expect(resUpdate.body.clientType).toBe('regular');
    });

    it('debe eliminar un cliente en la base de datos', async () => {
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Delete', phone: '849-000-0000', clientType: 'vip' });
        const id = resCreate.body.id;
        const resDelete = await request(app)
            .delete(`/api/v1/client/${id}`);
        expect([204, 200]).toContain(resDelete.status);
        const resGet = await request(app)
            .get(`/api/v1/client/${id}`);
        expect([404, 500]).toContain(resGet.status);
    });

    it('debe listar clientes paginados', async () => {
        await prisma.cliente.createMany({
            data: [
                { nombre: 'A', telefono: '809-111-1111', tipoCliente: 'regular' },
                { nombre: 'B', telefono: '829-222-2222', tipoCliente: 'vip' },
                { nombre: 'C', telefono: '849-333-3333', tipoCliente: 'regular' }
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

    it('debe rechazar actualización con teléfono en formato incorrecto', async () => {
        // Crear cliente válido primero
        const resCreate = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Valido', phone: '809-123-4567', clientType: 'regular' });
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
