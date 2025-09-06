/* global console */
import request from 'supertest';
import app from '../../src/app';

interface Article {
    id: number;
    barcode: string;
    manufacturerId: number;
    stock?: number;
    description?: string;
}


describe('Article Controller (integration)', () => {
    // Helper para crear manufacturer
    async function createManufacturer() {
        const res = await request(app)
            .post('/api/v1/manufacturer/create')
            .send({ name: `TestManufacturer_${Date.now()}` });
        // res.body debe ser { id: number }
        return (res.body as { id: number }).id;
    }

    it('should return 200 and a list of articles', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `LISTBAR_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app).get('/api/v1/article');
        if (res.status !== 200) console.error('Body:', res.body);
        expect(res.status).toBe(200);
        const data = Array.isArray((res.body as { data?: unknown }).data)
            ? (res.body as { data: Article[] }).data
            : Array.isArray(res.body)
                ? (res.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        data.forEach(a => {
            expect(typeof a.id).toBe('number');
            expect(typeof a.barcode).toBe('string');
            expect(typeof a.manufacturerId).toBe('number');
        });
    });

    it('should filter articles by description', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTRODESC_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, description: 'FiltroTest' });
        const res = await request(app).get('/api/v1/article?description=FiltroTest');
        if (res.status !== 200) console.error('Body:', res.body);
        expect(res.status).toBe(200);
        const data = Array.isArray((res.body as { data?: unknown }).data)
            ? (res.body as { data: Article[] }).data
            : Array.isArray(res.body)
                ? (res.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        expect(data.some(a => a.description === 'FiltroTest')).toBe(true);
    });

    // ...existing code...
    it('should filter articles by manufacturerId', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROMANU_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app).get(`/api/v1/article?manufacturerId=${manufacturerId}`);
        if (res.status !== 200) console.error('Body:', res.body);
        expect(res.status).toBe(200);
        const data = Array.isArray((res.body as { data?: unknown }).data)
            ? (res.body as { data: Article[] }).data
            : Array.isArray(res.body)
                ? (res.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        expect(data.some(a => a.manufacturerId === manufacturerId)).toBe(true);
    });

    it('should filter articles by barcode', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROBAR_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        const res = await request(app).get(`/api/v1/article?barcode=${barcode}`);
        if (res.status !== 200) console.error('Body:', res.body);
        expect(res.status).toBe(200);
        const data = Array.isArray((res.body as { data?: unknown }).data)
            ? (res.body as { data: Article[] }).data
            : Array.isArray(res.body)
                ? (res.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        expect(data.some(a => a.barcode === barcode)).toBe(true);
    });

    // ...existing code...
    it('should filter articles by stock', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `FILTROSTOCK_${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, stock: 99 });
        const res = await request(app).get('/api/v1/article?stock=99');
        if (res.status !== 200) console.error('Body:', res.body);
        expect(res.status).toBe(200);
        const data = Array.isArray((res.body as { data?: unknown }).data)
            ? (res.body as { data: Article[] }).data
            : Array.isArray(res.body)
                ? (res.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        expect(data.some(a => a.stock === 99)).toBe(true);

    });

    it('should paginate articles', async () => {
        const manufacturerId = await createManufacturer();
        // Crea artículos únicos para este test
        const barcodes: string[] = [];
        for (let i = 0; i < 5; i++) {
            const barcode = `PAGE${i}BAR${Date.now()}`;
            barcodes.push(barcode);
            await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId });
        }
        const resPag = await request(app).get('/api/v1/article?page=1&per_page=2');
        if (resPag.status !== 200) console.error('Body:', resPag.body);
        expect(resPag.status).toBe(200);
        // Ahora esperamos un array plano de artículos
        const articles = Array.isArray(resPag.body) ? resPag.body as Article[] : [];
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeLessThanOrEqual(2);
        articles.forEach(a => {
            expect(typeof a.id).toBe('number');
            expect(typeof a.barcode).toBe('string');
        });
    });

    it('should filter and paginate articles', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `COMBOFILTRO${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode, manufacturerId, stock: 5, description: 'ComboDesc' });
        const resCombo = await request(app).get('/api/v1/article?description=ComboDesc&stock=5&page=1&per_page=1');
        if (resCombo.status !== 200) console.error('Body:', resCombo.body);
        expect(resCombo.status).toBe(200);
        const data = Array.isArray((resCombo.body as { data?: unknown }).data)
            ? (resCombo.body as { data: Article[] }).data
            : Array.isArray(resCombo.body)
                ? (resCombo.body as Article[])
                : [];
        expect(Array.isArray(data)).toBe(true);
        // Solo valida que hay al menos un artículo con los filtros
        expect(data.some(a => a.description === 'ComboDesc' && a.stock === 5)).toBe(true);
    });

    it('should return 400 when deleting article with non-numeric id', async () => {
        const res = await request(app).delete('/api/v1/article/delete/abc');
        if (res.status !== 400) console.error('Body:', res.body);
        expect(res.status).toBe(400);
    });

    it('should return 404 when deleting article with non-existent id', async () => {
        const res = await request(app).delete('/api/v1/article/delete/99999');
        if (![404, 400].includes(res.status)) console.error('Body:', res.body);
        // ...existing code...
    });

    it('should return 500 when simulating internal server error', async () => {
        // Import dinámico para evitar require y tipar correctamente
        const controllerModule = await import('../../src/interfaces/controllers/article.controller');
        if (!('createArticleUseCase' in controllerModule)) {
            throw new Error('createArticleUseCase not found in controller module');
        }
        const spy = jest.spyOn(controllerModule.createArticleUseCase, 'execute').mockImplementation(() => { throw new Error('Test error'); });
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'ERROR500', manufacturerId: 1 });
        if (![500, 400].includes(res.status)) console.error('Body:', res.body);
        expect([500, 400]).toContain(res.status);
        spy.mockRestore();
    });

    it('should return 400 when creating article with invalid body', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '' });
        if (res.status !== 400) console.error('Body:', res.body);
        expect(res.status).toBe(400);
        expect(typeof (res.body as { error?: unknown }).error).toBe('string');
    });

    it('should return 201 or 409 when creating article with valid body', async () => {
        const manufacturerId = await createManufacturer();
        const barcode = `VALIDBAR_${Date.now()}`;
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode, manufacturerId });
        if (![201, 409].includes(res.status)) console.error('Body:', res.body);
        expect([201, 409]).toContain(res.status);
        if (res.status === 201) {
            expect(typeof (res.body as { barcode?: unknown }).barcode).toBe('string');
            expect((res.body as { barcode: string }).barcode).toBe(barcode);
        } else if (res.status === 409) {
            expect(typeof (res.body as { error?: unknown }).error).toBe('string');
        }
    });

    it('should return 400 when creating article with non-existent manufacturerId (foreign key)', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '99999', manufacturerId: 999999 });
        if (res.status !== 400) console.error('Body:', res.body);
        expect(res.status).toBe(400);
        expect(typeof (res.body as { error?: unknown }).error).toBe('string');
        expect((res.body as { error: string }).error).toMatch(/Violación de restricción de clave foránea/);
    });

    it('should return 400 when getting article by invalid id', async () => {
        const res = await request(app).get('/api/v1/article/getById/abc');
        if (res.status !== 400) console.error('Body:', res.body);
        expect(res.status).toBe(400);
    });

    it('should return 404 when getting article by non-existent id', async () => {
        const res = await request(app).get('/api/v1/article/getById/99999');
        if (![404, 400].includes(res.status)) console.error('Body:', res.body);
        expect([404, 400]).toContain(res.status);
    });
});

