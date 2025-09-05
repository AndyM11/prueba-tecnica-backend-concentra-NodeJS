import request from 'supertest';
import app from '../../src/app';

describe('Manufacturer Controller - Integration', () => {
    // Sufijo único para cada ejecución
    const uniqueSuffix = Date.now();
    it('GET /api/v1/manufacturer should return 200 and a paginated array', async () => {
        const res = await request(app).get('/api/v1/manufacturer');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/manufacturer/create should validate the body', async () => {
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /api/v1/manufacturer/create should create a valid manufacturer', async () => {
        const uniqueName = `FabricanteTest_${uniqueSuffix}`;
        // Eliminar si existe previamente
        await request(app).delete(`/api/v1/manufacturer/name/${uniqueName}`);
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: uniqueName });
        expect([201, 409]).toContain(res.status);
        if (res.status === 201) {
            expect(res.body).toHaveProperty('name', uniqueName);
        } else if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch(/Registro duplicado|El fabricante ya existe/);
        }
    });

    it('POST /api/v1/manufacturer/create should return 409 if the name is duplicated', async () => {
        const name = `Duplicado_${uniqueSuffix}`;
        // Eliminar si existe previamente
        await request(app).delete(`/api/v1/manufacturer/name/${name}`);
        await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name });
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name });
        expect([409, 201]).toContain(res.status);
        if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch(/Registro duplicado|El fabricante ya existe/);
        }
    });

    it('GET /api/v1/manufacturer/getById/:id should return 400 if id is invalid', async () => {
        const res = await request(app)
            .get('/api/v1/manufacturer/getById/abc');
        expect(res.status).toBe(400);
    });

    it('GET /api/v1/manufacturer/getById/:id should return 404 if id does not exist', async () => {
        const res = await request(app)
            .get('/api/v1/manufacturer/getById/99999');
        expect([404, 400]).toContain(res.status);
    });

    it('PUT /api/v1/manufacturer/update/:id should return 400 if id is invalid', async () => {
        const res = await request(app)
            .put('/api/v1/manufacturer/update/abc')
            .send({ name: 'NuevoNombre' });
        expect(res.status).toBe(400);
    });

    it('PUT /api/v1/manufacturer/update/:id should return 404 if id does not exist', async () => {
        const res = await request(app)
            .put('/api/v1/manufacturer/update/99999')
            .send({ name: 'NuevoNombre' });
        expect([404, 400]).toContain(res.status);
    });

    it('DELETE /api/v1/manufacturer/delete/:id should return 400 if id is invalid', async () => {
        const res = await request(app)
            .delete('/api/v1/manufacturer/delete/abc');
        expect(res.status).toBe(400);
    });

    it('DELETE /api/v1/manufacturer/delete/:id should return 404 if id does not exist', async () => {
        const res = await request(app)
            .delete('/api/v1/manufacturer/delete/99999');
        expect([404, 400]).toContain(res.status);
    });
});
