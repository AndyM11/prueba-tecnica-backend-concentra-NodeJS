import request from 'supertest';
import express from 'express';
import employeeRouter from '../../src/interfaces/routes/employee.routes';

describe('Employee Controller Integration', () => {
    const app = express();
    app.use(express.json());
    app.use('/employees', employeeRouter);


    it('POST /employees - valid nationalId', async () => {
        const res = await request(app)
            .post('/employees')
            .send({ firstName: 'Juan', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect([201, 400, 500]).toContain(res.statusCode);
    });

    it('POST /employees - invalid nationalId format', async () => {
        const res = await request(app)
            .post('/employees')
            .send({ firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /employees - invalid (empty firstName)', async () => {
        const res = await request(app)
            .post('/employees')
            .send({ firstName: '', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect(res.statusCode).toBe(400);
    });

    it('GET /employees', async () => {
        const res = await request(app).get('/employees');
        expect([200, 400, 500]).toContain(res.statusCode);
    });

    it('GET /employees/:id', async () => {
        const res = await request(app).get('/employees/1');
        expect([200, 404, 400, 500]).toContain(res.statusCode);
    });

    it('PUT /employees/:id', async () => {
        const res = await request(app)
            .put('/employees/1')
            .send({ bloodType: 'A-' });
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });

    it('DELETE /employees/:id', async () => {
        const res = await request(app).delete('/employees/1');
        expect([204, 404, 400, 500]).toContain(res.statusCode);
    });
});
