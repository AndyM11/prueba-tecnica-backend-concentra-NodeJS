import request from 'supertest';
import app from '../../src/app';

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
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(uniqueName);
        createdId = res.body.id;
    });

    it('GET /api/v1/location should list locations', async () => {
        const res = await request(app).get('/api/v1/location');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/v1/location/:id should get a location by id', async () => {
        const res = await request(app).get(`/api/v1/location/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdId);
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
});
