import request from 'supertest';
import express from 'express';
import clientRoutes from '../../src/interfaces/routes/client.routes';
import { ClientType } from '../../src/domain/entities/Types';

describe('ClientController (unit)', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/client', clientRoutes);
    });

    it('should create a valid client', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Juan', phone: '809-123-4567', clientType: 'regular' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Juan');
        expect(res.body.clientType).toBe(ClientType.REGULAR);
    });

    it('should reject client with invalid data', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: '', phone: '123', clientType: 'vip' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should get a client by non-existent id', async () => {
        const res = await request(app)
            .get('/api/v1/client/99999');
        expect([404]).toContain(res.status);
    });

    it('should update a client with valid data', async () => {
        // Primero crear
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Ana', phone: '809-567-8901', clientType: 'vip' });
        const id = createRes.body.id;
        // Actualizar (incluye teléfono válido)
        const updateRes = await request(app)
            .put(`/api/v1/client/${id}`)
            .send({ name: 'Ana Actualizada', phone: '809-567-8901' });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.name).toBe('Ana Actualizada');
    });

    it('should delete an existing client', async () => {
        // Crear
        const createRes = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Pedro', phone: '809-345-6789', clientType: 'regular' });
        const id = createRes.body.id;
        // Eliminar
        const deleteRes = await request(app)
            .delete(`/api/v1/client/${id}`);
        expect([204, 200]).toContain(deleteRes.status);
    });

    it('should filter clients by name', async () => {
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Carlos', phone: '809-333-4444', clientType: 'regular' });
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Carla', phone: '829-444-5555', clientType: 'vip' });
        const res = await request(app)
            .get('/api/v1/client?name=Car')
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        expect(res.body.data.some((c: any) => c.name.includes('Car'))).toBe(true);
    });

    it('should filter clients by phone', async () => {
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Mario', phone: '809-678-9012', clientType: 'regular' });
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Luigi', phone: '809-789-0123', clientType: 'vip' });
        const res = await request(app)
            .get('/api/v1/client?phone=809-6')
        expect(res.status).toBe(200);
        expect(res.body.data.some((c: any) => c.phone.includes('809-6'))).toBe(true);
    });

    it('should filter clients by clientType', async () => {
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Regu', phone: '809-555-5555', clientType: 'regular' });
        await request(app)
            .post('/api/v1/client')
            .send({ name: 'Vip', phone: '809-666-6666', clientType: 'vip' });
        const res = await request(app)
            .get('/api/v1/client?clientType=vip')
        expect(res.status).toBe(200);
        expect(res.body.data.every((c: any) => c.clientType === 'vip')).toBe(true);
    });

    it('should reject registration with incorrect phone format', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Error', phone: '123-456-7890', clientType: 'regular' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(['Datos inválidos', 'El teléfono tiene un formato inválido']).toContain(res.body.error);
    });

    it('should reject registration with invalid prefix', async () => {
        const res = await request(app)
            .post('/api/v1/client')
            .send({ name: 'Error', phone: '800-123-4567', clientType: 'vip' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(['Datos inválidos', 'El teléfono tiene un formato inválido']).toContain(res.body.error);
    });
});
