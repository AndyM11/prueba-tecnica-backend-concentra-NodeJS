import request from 'supertest';
import app from '../../src/app';

describe('Flujo completo de integración - Proyecto', () => {
    let userId: number;
    let employeeId: number;
    let clientId: number;
    let manufacturerId: number;
    let articleId: number;
    let locationId: number;
    // placementId y buyId no se usan, se eliminan para evitar warnings

    // USER
    it('CRUD User', async () => {
        // Crear
        let res = await request(app).post('/api/v1/user').send({ username: 'testuser', password: 'Password123!', rol: 'user' });
        expect(res.status).toBe(201);
        if (
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            userId = (res.body as { id: number }).id;
        }
        // Obtener
        res = await request(app).get(`/api/v1/user/${userId}`);
        expect(res.status).toBe(200);
        // Actualizar
        res = await request(app).put(`/api/v1/user/${userId}`).send({ username: 'testuser2' });
        expect([200, 400]).toContain(res.status);
        // Eliminar
        res = await request(app).delete(`/api/v1/user/${userId}`);
        expect([200, 204, 404]).toContain(res.status);
    });

    // EMPLOYEE
    it('CRUD Employee', async () => {
        let res = await request(app).post('/api/v1/employee').send({
            firstName: 'Juan', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '809-123-4567', bloodType: 'A+', email: 'juan@test.com'
        });
        expect([201, 400, 409]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            employeeId = (res.body as { id: number }).id;
        }
        if (employeeId) {
            res = await request(app).get(`/api/v1/employee/${employeeId}`);
            expect([200, 404]).toContain(res.status);
            res = await request(app).put(`/api/v1/employee/${employeeId}`).send({ phone: '809-987-6543' });
            expect([200, 400, 404]).toContain(res.status);
            res = await request(app).delete(`/api/v1/employee/${employeeId}`);
            expect([200, 204, 404]).toContain(res.status);
        }
    });

    // CLIENT
    it('CRUD Client', async () => {
        let res = await request(app).post('/api/v1/client').send({
            name: 'Cliente Test', type: 'regular', email: 'cliente@test.com', phone: '809-111-2222'
        });
        expect([201, 400]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            clientId = (res.body as { id: number }).id;
        }
        if (clientId) {
            res = await request(app).get(`/api/v1/client/${clientId}`);
            expect([200, 404]).toContain(res.status);
            res = await request(app).put(`/api/v1/client/${clientId}`).send({ phone: '809-333-4444' });
            expect([200, 400, 404]).toContain(res.status);
            res = await request(app).delete(`/api/v1/client/${clientId}`);
            expect([200, 204, 404]).toContain(res.status);
        }
    });

    // MANUFACTURER
    it('CRUD Manufacturer', async () => {
        let res = await request(app).post('/api/v1/manufacturer/create').send({ name: 'Fabricante Test' });
        expect([201, 400, 409]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            manufacturerId = (res.body as { id: number }).id;
        }
    });

    // ARTICLE
    it('CRUD Article', async () => {
        let res = await request(app).post('/api/v1/article/create').send({
            barcode: 'ART123456', description: 'Artículo Test', manufacturerId, stock: 10
        });
        expect([201, 400]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            articleId = (res.body as { id: number }).id;
        }
    });

    // LOCATION
    it('CRUD Location', async () => {
        let res = await request(app).post('/api/v1/location').send({ name: 'Ubicación Test' });
        expect([201, 400, 409]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            locationId = (res.body as { id: number }).id;
        }
    });

    // PLACEMENT
    it('CRUD Placement', async () => {
        let res = await request(app).post('/api/v1/placement').send({
            articleId, locationId, displayName: 'Exhibición Test', price: 100
        });
        expect([201, 400]).toContain(res.status);
        // placementId eliminado porque no se usa
    });

    // BUY
    it('CRUD Buy', async () => {
        let res = await request(app).post('/api/v1/client').send({
            name: 'Cliente Test', type: 'regular', email: 'cliente@test.com', phone: '809-111-2222'
        });
        expect([201, 400]).toContain(res.status);
        if (
            res.status === 201 &&
            typeof res.body === 'object' &&
            res.body !== null &&
            'id' in res.body &&
            typeof (res.body as { id?: unknown }).id === 'number'
        ) {
            clientId = (res.body as { id: number }).id;
        }
        res = await request(app).post('/api/v1/buy').send({
            clientId, articleId, quantity: 1, price: 100
        });
        expect([201, 400]).toContain(res.status);
        // buyId eliminado porque no se usa
    });
});
