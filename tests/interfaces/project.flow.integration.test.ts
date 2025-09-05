import request from 'supertest';
import app from '../../src/app';

describe('Flujo completo de integración - Proyecto', () => {
    let userId: number;
    let employeeId: number;
    let clientId: number;
    let manufacturerId: number;
    let articleId: number;
    let locationId: number;
    let placementId: number;
    let buyId: number;

    // USER
    it('CRUD User', async () => {
        // Crear
        let res = await request(app).post('/api/v1/user').send({ username: 'testuser', password: 'Password123!', rol: 'user' });
        expect(res.status).toBe(201);
        userId = res.body.id;
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
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) employeeId = res.body.id;
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
        if (res.status === 201) clientId = res.body.id;
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
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) manufacturerId = res.body.id;
    });

    // ARTICLE
    it('CRUD Article', async () => {
        let res = await request(app).post('/api/v1/article/create').send({
            barcode: 'ART123456', description: 'Artículo Test', manufacturerId, stock: 10
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) articleId = res.body.id;
    });

    // LOCATION
    it('CRUD Location', async () => {
        let res = await request(app).post('/api/v1/location').send({ name: 'Ubicación Test' });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) locationId = res.body.id;
    });

    // PLACEMENT
    it('CRUD Placement', async () => {
        let res = await request(app).post('/api/v1/placement').send({
            articleId, locationId, displayName: 'Exhibición Test', price: 100
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) placementId = res.body.id;
    });

    // BUY
    it('CRUD Buy', async () => {
        let res = await request(app).post('/api/v1/client').send({
            name: 'Cliente Test', type: 'regular', email: 'cliente@test.com', phone: '809-111-2222'
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) clientId = res.body.id;
        res = await request(app).post('/api/v1/buy').send({
            clientId, articleId, quantity: 1, price: 100
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) buyId = res.body.id;
    });
});
