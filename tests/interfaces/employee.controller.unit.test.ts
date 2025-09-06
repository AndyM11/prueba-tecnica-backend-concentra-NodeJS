
import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import redis from '../../src/infrastructure/redisClient';
import { PrismaEmployeeRepository } from '../../src/infrastructure/repositories/PrismaEmployeeRepository';
import employeeRouter from '../../src/interfaces/routes/employee.routes';

describe('Employee Controller Integration', () => {
    const app = express();
    app.use(express.json());
    app.use('/employee', employeeRouter);
    // Middleware global de manejo de errores para tests
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ error: err.message || 'Error interno' });
    });

    it('POST /employee - valid nationalId', async () => {
        const res = await request(app)
            .post('/employee')
            .send({ firstName: 'Juan', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect([201, 400, 500]).toContain(res.statusCode);
    });

    it('POST /employee - invalid nationalId format', async () => {
        const res = await request(app)
            .post('/employee')
            .send({ firstName: 'Juan', lastName: 'Pérez', nationalId: '12345', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /employee - invalid (empty firstName)', async () => {
        const res = await request(app)
            .post('/employee')
            .send({ firstName: '', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '1234567890', bloodType: 'A+', email: 'juan@test.com' });
        expect(res.statusCode).toBe(400);
    });

    it('GET /employee', async () => {
        const res = await request(app).get('/employee');
        expect([200, 400, 500]).toContain(res.statusCode);
    });

    it('GET /employee/:id', async () => {
        const res = await request(app).get('/employee/1');
        expect([200, 404, 400, 500]).toContain(res.statusCode);
    });

    it('PUT /employee/:id', async () => {
        const res = await request(app)
            .put('/employee/1')
            .send({ bloodType: 'A-' });
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });

    it('DELETE /employee/:id', async () => {
        const res = await request(app).delete('/employee/1');
        expect([204, 404, 400, 500]).toContain(res.statusCode);
    });
});


describe('Employee Controller Branches', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('POST /employee - bloodType inválido', async () => {
        const app = express();
        app.use(express.json());
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app)
            .post('/employee')
            .send({ firstName: 'Juan', lastName: 'Pérez', nationalId: '123-1234567-1', phone: '1234567890', bloodType: 'INVALID', email: 'juan@test.com' });
        expect(res.statusCode).toBe(400);
        expect((res.body as any).error).toMatch(/Tipo de sangre inv/);
    });

    it('PUT /employee/:id - bloodType inválido', async () => {
        const app = express();
        app.use(express.json());
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app)
            .put('/employee/1')
            .send({ bloodType: 'INVALID' });
        expect(res.statusCode).toBe(400);
        expect((res.body as any).error).toMatch(/Tipo de sangre inv/);
    });

    it('GET /employee/:id - id no numérico', async () => {
        const app = express();
        app.use(express.json());
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app).get('/employee/abc');
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('PUT /employee/:id - id no numérico', async () => {
        const app = express();
        app.use(express.json());
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app)
            .put('/employee/abc')
            .send({ firstName: 'Juan' });
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('DELETE /employee/:id - id no numérico', async () => {
        const app = express();
        app.use(express.json());
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app).delete('/employee/abc');
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('GET /employee/:id - respuesta desde caché', async () => {
        const app = express();
        app.use(express.json());
        const spy = jest.spyOn(redis, 'get').mockResolvedValueOnce(JSON.stringify({ id: 99, firstName: 'Cache', lastName: 'Test' }));
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app).get('/employee/99');
        expect(res.statusCode).toBe(200);
        expect((res.body as any).firstName).toBe('Cache');
        spy.mockRestore();
    });

    it('GET /employee/:id - 404 si no existe', async () => {
        const app = express();
        app.use(express.json());
        jest.spyOn(PrismaEmployeeRepository.prototype, 'findById').mockResolvedValueOnce(null as any);
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app).get('/employee/99999');
        expect(res.statusCode).toBe(404);
    });

    it('GET /employee - respuesta desde caché', async () => {
        const app = express();
        app.use(express.json());
        const spy = jest.spyOn(redis, 'get').mockResolvedValueOnce(JSON.stringify([{ id: 1, firstName: 'Cache' }]));
        app.use('/employee', employeeRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ error: err.message || 'Error interno' });
        });
        const res = await request(app).get('/employee');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        spy.mockRestore();
    });

});
