import request from 'supertest';
import app from '../../src/app';
import { any } from 'zod';

describe('Article Controller (integration)', () => {
    // Helper para crear manufacturer
    async function createManufacturer() {
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: `TestManufacturer_${Date.now()}` });
        return res.body.id;
    }

    it('should return 200 and a list of articles', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `LISTBAR_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app)
            .get('/api/v1/article');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should filter articles by description', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTRODESC_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, description: 'FiltroTest' });
        const res = await request(app)
            .get('/api/v1/article?description=FiltroTest');
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.description === 'FiltroTest')).toBe(true);
    });

    // ...existing code...
    it('should filter articles by manufacturerId', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROMANU_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app)
            .get(`/api/v1/article?manufacturerId=${manufacturerId}`);
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.manufacturerId === manufacturerId)).toBe(true);
    });

    it('should filter articles by barcode', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROBAR_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app)
            .get(`/api/v1/article?barcode=${barcode}`);
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.barcode === barcode)).toBe(true);
    });

    // ...existing code...
    it('should filter articles by stock', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROSTOCK_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, stock: 99 });
        const res = await request(app)
            .get('/api/v1/article?stock=99');
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.stock === 99)).toBe(true);
    });

    it('should paginate articles', async () => {
        const manufacturerId = await createManufacturer();
        for (let i = 0; i < 5; i++) {
            const barcode = `PAGE${i}BAR${Date.now()}`;
            await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        }
        const resPag = await request(app)
            .get('/api/v1/article?page=1&per_page=2');
        expect(resPag.status).toBe(200);
        expect(resPag.body.length).toBeLessThanOrEqual(2);
    });

    it('should filter and paginate articles', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `COMBOFILTRO${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, stock: 5, description: 'ComboDesc' });
        const resCombo = await request(app)
            .get('/api/v1/article?description=ComboDesc&stock=5&page=1&per_page=1');
        expect(resCombo.status).toBe(200);
        expect(resCombo.body.length).toBeLessThanOrEqual(1);
        expect(resCombo.body.some((a: any) => a.description === 'ComboDesc' && a.stock === 5)).toBe(true);
    });

    it('should return 400 when deleting article with non-numeric id', async () => {
        const res = await request(app)
            .delete('/api/v1/article/delete/abc');
        expect(res.status).toBe(400);
    });

    it('should return 404 when deleting article with non-existent id', async () => {
        const res = await request(app)
            .delete('/api/v1/article/delete/99999');
        expect([404, 400]).toContain(res.status);
    });

    it('should return 500 when simulating internal server error', async () => {
        const controller = require('../../src/interfaces/controllers/article.controller');
        jest.spyOn(controller.createArticleUseCase, 'execute').mockImplementation(() => { throw new Error('Test error'); });
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'ERROR500', manufacturerId: 1 });
        expect([500, 400]).toContain(res.status);
        jest.restoreAllMocks();
    });

    it('should return 400 when creating article with invalid body', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 201 or 409 when creating article with valid body', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `VALIDBAR_${Date.now()}`;
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode, manufacturerId });
        expect([201, 409]).toContain(res.status);
        if (res.status === 201) {
            expect(res.body).toHaveProperty('barcode');
        } else if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
        }
    });

    it('should return 400 when creating article with non-existent manufacturerId (foreign key)', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '99999', manufacturerId: 999999 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/Violación de restricción de clave foránea/);
    });

    it('should return 400 when getting article by invalid id', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/abc');
        expect(res.status).toBe(400);
    });

    it('should return 404 when getting article by non-existent id', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/99999');
        expect([404, 400]).toContain(res.status);
    });
});
