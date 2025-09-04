import request from 'supertest';
import app from '../../src/app';

let articuloId: number;
let articleId: number;
let locationId: number;
// Generar valores únicos para cada ejecución
const uniqueSuffix = Date.now();
const testBarcode = `TESTPLACEMENT_${uniqueSuffix}`;
const testLocation = `LocationTest_${uniqueSuffix}`;

describe('Placement Controller (integration)', () => {
    beforeAll(async () => {
        // Eliminar registros previos si existen
        await request(app)
            .delete('/api/v1/article/barcode/' + testBarcode);
        await request(app)
            .delete('/api/v1/location/name/' + testLocation);
        // Crear artículo y ubicación válidos
        const articuloRes = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: testBarcode, manufacturerId: 1 });
        articleId = articuloRes.body.id;
        const ubicacionRes = await request(app)
            .post('/api/v1/location')
            .send({ name: testLocation });
        locationId = ubicacionRes.body.id;
    });

    it('debería devolver 200 y una lista paginada de colocaciones', async () => {
        const res = await request(app)
            .get('/api/v1/placement')
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('debería filtrar por articuloId', async () => {
        const res = await request(app)
            .get(`/api/v1/placement?articleId=${articleId}`)
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    it('debería devolver 400 al crear con datos inválidos', async () => {
        const res = await request(app)
            .post('/api/v1/placement')
            .send({ displayName: '', price: -1 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('debería crear una colocación válida', async () => {
        const res = await request(app)
            .post('/api/v1/placement')
            .send({ articleId, locationId, displayName: `DisplayTest_${uniqueSuffix}`, price: 99.99 });
        expect([201, 409]).toContain(res.status);
        if (res.status === 201) {
            expect(res.body).toHaveProperty('displayName', `DisplayTest_${uniqueSuffix}`);
        } else if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
        }
    });

    it('debería devolver 400 si el id es inválido en getById', async () => {
        const res = await request(app)
            .get('/api/v1/placement/abc');
        expect(res.status).toBe(400);
    });

    it('debería devolver 404 si el id no existe en getById', async () => {
        const res = await request(app)
            .get('/api/v1/placement/99999');
        expect([404, 400]).toContain(res.status);
    });

    it('debería devolver 400 si el id es inválido en update', async () => {
        const res = await request(app)
            .put('/api/v1/placement/abc')
            .send({ displayName: 'Nuevo' });
        expect(res.status).toBe(400);
    });

    it('debería devolver 404 si el id no existe en update', async () => {
        const res = await request(app)
            .put('/api/v1/placement/99999')
            .send({ displayName: 'Nuevo' });
        expect([404, 400]).toContain(res.status);
    });

    it('debería devolver 400 si el id es inválido en delete', async () => {
        const res = await request(app)
            .delete('/api/v1/placement/abc');
        expect(res.status).toBe(400);
    });

    it('debería devolver 404 si el id no existe en delete', async () => {
        const res = await request(app)
            .delete('/api/v1/placement/99999');
        expect([404, 400]).toContain(res.status);
    });
});
