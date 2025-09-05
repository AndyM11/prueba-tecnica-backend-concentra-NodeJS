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
        // Crear fabricante válido y obtener su ID
        const fabricanteRes = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: `FabricanteTest_${uniqueSuffix}` });
        const manufacturerId = fabricanteRes.body.id;
        // Crear artículo y ubicación válidos
        const articuloRes = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: testBarcode, manufacturerId });
        articleId = articuloRes.body.id;
        const ubicacionRes = await request(app)
            .post('/api/v1/location')
            .send({ name: testLocation });
        locationId = ubicacionRes.body.id;
    });

    it('should return 200 and a paginated list of placements', async () => {
        const res = await request(app)
            .get('/api/v1/placement')
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by articleId', async () => {
        const res = await request(app)
            .get(`/api/v1/placement?articleId=${articleId}`)
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    it('should return 400 when creating with invalid data', async () => {
        const res = await request(app)
            .post('/api/v1/placement')
            .send({ displayName: '', price: -1 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should create a valid placement', async () => {
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

    it('should return 400 if id is invalid in getById', async () => {
        const res = await request(app)
            .get('/api/v1/placement/abc');
        expect(res.status).toBe(400);
    });

    it('should return 404 if id does not exist in getById', async () => {
        const res = await request(app)
            .get('/api/v1/placement/99999');
        expect([404, 400]).toContain(res.status);
    });

    it('should return 400 if id is invalid in update', async () => {
        const res = await request(app)
            .put('/api/v1/placement/abc')
            .send({ displayName: 'Nuevo' });
        expect(res.status).toBe(400);
    });

    it('should return 404 if id does not exist in update', async () => {
        const res = await request(app)
            .put('/api/v1/placement/99999')
            .send({ displayName: 'Nuevo' });
        expect([404, 400]).toContain(res.status);
    });

    it('should return 400 if id is invalid in delete', async () => {
        const res = await request(app)
            .delete('/api/v1/placement/abc');
        expect(res.status).toBe(400);
    });

    it('should return 404 if id does not exist in delete', async () => {
        const res = await request(app)
            .delete('/api/v1/placement/99999');
        expect([404, 400]).toContain(res.status);
    });
});
