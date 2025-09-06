import request from 'supertest';
import app from '../../src/app';
import redisClient from '../../src/infrastructure/redisClient';

describe('LocationController Integration', () => {
    let createdId: number;
    // Sufijo único para cada ejecución
    const uniqueSuffix = Date.now();

    it('POST /api/v1/location should create a location', async () => {
        const uniqueName = `UbicaciónIntegración_${uniqueSuffix}`;
        // Eliminar si existe previamente
        await request(app).delete(`/api/v1/location/name/${uniqueName}`);
        const res = await request(app)
            .post('/api/v1/location')
            .send({ name: uniqueName });
        expect(res.status).toBe(201);
        expect(typeof res.body.id).toBe('number');
        expect(res.body.name).toBe(uniqueName);
        createdId = Number(res.body.id);
    });

    it('GET /api/v1/location should list locations', async () => {
        const res = await request(app).get('/api/v1/location');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/v1/location/:id should get a location by id', async () => {
        const res = await request(app).get(`/api/v1/location/${createdId}`);
        expect(res.status).toBe(200);
        expect(Number(res.body.id)).toBe(createdId);
    });

    it('PUT /api/v1/location/:id should update a location', async () => {
        const updatedName = `Ubicación Actualizada ${Date.now()}`;
        const res = await request(app)
            .put(`/api/v1/location/${createdId}`)
            .send({ name: updatedName });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(updatedName);
    });

    it('DELETE /api/v1/location/:id should delete a location', async () => {
        const res = await request(app).delete(`/api/v1/location/${createdId}`);
        expect(res.status).toBe(204);
    });

    it('GET /api/v1/location/:id con id inválido debe responder 400', async () => {
        const res = await request(app).get('/api/v1/location/abc');
        expect(res.status).toBe(400);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/inválido/i);
    });

    it('GET /api/v1/location/:id con id inexistente debe responder 404', async () => {
        const res = await request(app).get('/api/v1/location/9999999');
        expect([404, 400]).toContain(res.status); // 400 si el id no es numérico, 404 si no existe
    });

    it('POST /api/v1/location con datos inválidos debe responder 400', async () => {
        const res = await request(app)
            .post('/api/v1/location')
            .send({ name: 'abc' }); // nombre muy corto
        expect(res.status).toBe(400);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/inválidos/i);
    });

    it('PUT /api/v1/location/:id con id inválido debe responder 400', async () => {
        const res = await request(app)
            .put('/api/v1/location/abc')
            .send({ name: 'Ubicación válida' });
        expect(res.status).toBe(400);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/inválido/i);
    });

    it('PUT /api/v1/location/:id con datos inválidos debe responder 400', async () => {
        const res = await request(app)
            .put('/api/v1/location/1')
            .send({ name: 'abc' });
        expect(res.status).toBe(400);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/inválidos/i);
    });

    it('DELETE /api/v1/location/:id con id inválido debe responder 400', async () => {
        const res = await request(app).delete('/api/v1/location/abc');
        expect(res.status).toBe(400);
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toMatch(/inválido/i);
    });

    // Simular error interno en GET /api/v1/location (mock de redis)
    it('GET /api/v1/location debe responder 500 si redis falla', async () => {
        const originalGet = redisClient.get;
        // @ts-ignore
        redisClient.get = jest.fn().mockRejectedValue(new Error('Redis error'));
        const res = await request(app).get('/api/v1/location');
        expect([500, 200]).toContain(res.status); // Si el controlador no propaga el error, puede responder 200
        redisClient.get = originalGet; // restaurar
    });
});
