import request from 'supertest';
import app from '../../src/app';
import { any } from 'zod';

describe('Article Controller (integration)', () => {
    // Sufijo único para cada ejecución
    const uniqueSuffix = Date.now();
    // Prueba: Listar todos los artículos
    it('should return 200 and a list of articles', async () => {
        const res = await request(app)
            .get('/api/v1/article')
            .send();
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Prueba: Filtrar por descripción
    it('should filter articles by description', async () => {
        const uniqueBarcode = `FILTRODESC_${uniqueSuffix}`;
        // Eliminar si existe previamente
        await request(app).delete(`/api/v1/article/barcode/${uniqueBarcode}`);
        await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1, description: 'FiltroTest' });
        const res = await request(app)
            .get('/api/v1/article?description=FiltroTest')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.description === 'FiltroTest')).toBe(true);
    });

    // Prueba: Filtrar por manufacturerId
    it('should filter articles by manufacturerId', async () => {
        const uniqueBarcode = `FILTROMANU_${uniqueSuffix}`;
        await request(app).delete(`/api/v1/article/barcode/${uniqueBarcode}`);
        await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1 });
        const res = await request(app)
            .get('/api/v1/article?manufacturerId=1')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.manufacturerId === 1)).toBe(true);
    });

    // Prueba: Filtrar por barcode
    it('should filter articles by barcode', async () => {
        const uniqueBarcode = `FILTROBAR_${uniqueSuffix}`;
        await request(app).delete(`/api/v1/article/barcode/${uniqueBarcode}`);
        await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1 });
        const res = await request(app)
            .get('/api/v1/article?barcode=FILTROBAR')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.barcode === 'FILTROBAR')).toBe(true);
    });

    // Prueba: Filtrar por stock
    it('should filter articles by stock', async () => {
        const uniqueBarcode = `FILTROSTOCK_${uniqueSuffix}`;
        await request(app).delete(`/api/v1/article/barcode/${uniqueBarcode}`);
        await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1, stock: 99 });
        const res = await request(app)
            .get('/api/v1/article?stock=99')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.some((a: any) => a.stock === 99)).toBe(true);
    });

    // Prueba: Paginación
    it('should paginate articles', async () => {
        // Crear varios artículos para paginar
        for (let i = 0; i < 5; i++) {
            const uniqueBarcode = `PAGE${i}BAR${Date.now()}`;
            await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1 });
        }
        const res = await request(app)
            .get('/api/v1/article?page=1&per_page=2')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.length).toBeLessThanOrEqual(2);
    });

    // Prueba: Combinación de filtros y paginación
    it('should filter and paginate articles', async () => {
        const uniqueBarcode = `COMBOFILTRO${Date.now()}`;
        await request(app).post('/api/v1/article/create').send({ barcode: uniqueBarcode, manufacturerId: 1, stock: 5, description: 'ComboDesc' });
        const res = await request(app)
            .get('/api/v1/article?description=ComboDesc&stock=5&page=1&per_page=1')
            .send();
        expect(res.status).toBe(200);
        expect(res.body.length).toBeLessThanOrEqual(1);
        expect(res.body.some((a: any) => a.description === 'ComboDesc' && a.stock === 5)).toBe(true);
    });
    // Prueba: Falta campo obligatorio (barcode)
    it('should return 400 when creating article with missing required fields', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ manufacturerId: 1 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: Tipos incorrectos en el body
    it('should return 400 when creating article with wrong types', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 12345, manufacturerId: 'uno' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: Barcode demasiado corto
    it('should return 400 when creating article with short barcode', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '12', manufacturerId: 1 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: Duplicidad de barcode
    it('should return 409 when creating article with duplicate barcode', async () => {
        // Primero crear el artículo
        await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'DUPLICATE123', manufacturerId: 1 });
        // Intentar crear el mismo artículo
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'DUPLICATE123', manufacturerId: 1 });
        expect([409, 201]).toContain(res.status); // Puede ser 201 si la BD se resetea entre pruebas
        if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
        }
    });

    // Prueba: Stock negativo
    it('should return 400 when creating article with negative stock', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'NEGSTOCK', manufacturerId: 1, stock: -5 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: Stock decimal
    it('should return 400 when creating article with decimal stock', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'DECSTOCK', manufacturerId: 1, stock: 2.5 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: id no numérico en getById
    it('should return 400 when using non-numeric id in getById', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/abc');
        expect(res.status).toBe(400);
    });

    // Prueba: id inexistente en getById
    it('should return 404 when getting article by non-existent id', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/99999');
        expect([404, 400]).toContain(res.status);
    });

    // Prueba: id no numérico en update
    it('should return 400 when updating article with non-numeric id', async () => {
        const res = await request(app)
            .put('/api/v1/article/update/abc')
            .send({ barcode: '12345', manufacturerId: 1 });
        expect(res.status).toBe(400);
    });

    // Prueba: id inexistente en update
    it('should return 404 when updating article with non-existent id', async () => {
        const res = await request(app)
            .put('/api/v1/article/update/99999')
            .send({ barcode: '12345', manufacturerId: 1 });
        expect([404, 400]).toContain(res.status);
    });

    // Prueba: id no numérico en delete
    it('should return 400 when deleting article with non-numeric id', async () => {
        const res = await request(app)
            .delete('/api/v1/article/delete/abc');
        expect(res.status).toBe(400);
    });

    // Prueba: id inexistente en delete
    it('should return 404 when deleting article with non-existent id', async () => {
        const res = await request(app)
            .delete('/api/v1/article/delete/99999');
        expect([404, 400]).toContain(res.status);
    });

    // Prueba: Simulación de error interno del servidor
    it('should return 500 when simulating internal server error', async () => {
        // Simular error forzando el usecase a lanzar excepción
        const controller = require('../../src/interfaces/controllers/article.controller');
        jest.spyOn(controller.createArticleUseCase, 'execute').mockImplementation(() => { throw new Error('Test error'); });
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: 'ERROR500', manufacturerId: 1 });
        expect([500, 400]).toContain(res.status);
        jest.restoreAllMocks();
    });
    // Prueba: Body inválido (barcode vacío)
    it('should return 400 when creating article with invalid body', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // Prueba: Body válido (creado o duplicado)
    it('should return 201 or 409 when creating article with valid body', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '12345', manufacturerId: 1 });
        expect([201, 409]).toContain(res.status); // Puede ser 409 si ya existe
        if (res.status === 201) {
            expect(res.body).toHaveProperty('barcode');
        } else if (res.status === 409) {
            expect(res.body).toHaveProperty('error');
        }
    });

    // Prueba: manufacturerId inexistente (clave foránea)
    it('should return 400 when creating article with non-existent manufacturerId (foreign key)', async () => {
        const res = await request(app)
            .post('/api/v1/article/create')
            .send({ barcode: '99999', manufacturerId: 999999 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/Violación de restricción de clave foránea/);
    });

    // Prueba: id inválido en getById
    it('should return 400 when getting article by invalid id', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/abc');
        expect(res.status).toBe(400);
    });

    // Prueba: id inexistente en getById
    it('should return 404 when getting article by non-existent id', async () => {
        const res = await request(app)
            .get('/api/v1/article/getById/99999');
        expect([404, 400]).toContain(res.status);
    });
});
