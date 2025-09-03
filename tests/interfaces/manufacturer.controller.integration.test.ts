import request from 'supertest';
import app from '../../src/app';

describe('Manufacturer Controller - Integración', () => {
    it('GET /api/v1/manufacturer debe devolver 200 y un array paginado', async () => {
        const res = await request(app).get('/api/v1/manufacturer');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/manufacturer/create debe validar el body', async () => {
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
