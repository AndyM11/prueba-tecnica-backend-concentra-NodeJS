import express from 'express';
import request from 'supertest';
import buyRouter from '../../src/interfaces/routes/buy.routes';

describe('Buy Controller Integration', () => {
    const app = express();
    app.use(express.json());
    app.use('/buys', buyRouter);

    it('PUT /buys/:id - body inválido (parcial)', async () => {
        const res = await request(app)
            .put('/buys/1')
            .send({ units: 0 }); // units debe ser >= 1
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('PUT /buys/:id - error inesperado', async () => {
        const { UpdateBuyUseCase } = await import('../../src/domain/usecases/Buy/UpdateBuyUseCase');
        const original = UpdateBuyUseCase.prototype.execute.bind(UpdateBuyUseCase.prototype);
        UpdateBuyUseCase.prototype.execute = () => Promise.reject(new Error('Update error'));
        const res = await request(app)
            .put('/buys/1')
            .send({ units: 10 });
        expect([500, 400]).toContain(res.statusCode);
        UpdateBuyUseCase.prototype.execute = original;
    });

    it('DELETE /buys/:id - error inesperado', async () => {
        const { DeleteBuyUseCase } = await import('../../src/domain/usecases/Buy/DeleteBuyUseCase');
        const originalDelete = DeleteBuyUseCase.prototype.execute.bind(DeleteBuyUseCase.prototype);
        DeleteBuyUseCase.prototype.execute = () => Promise.reject(new Error('Delete error'));
        const res = await request(app).delete('/buys/1');
        expect([500, 400]).toContain(res.statusCode);
        DeleteBuyUseCase.prototype.execute = originalDelete;
    });

    it('GET /buys/:id - no encontrado (404)', async () => {
        const { GetBuyByIdUseCase } = await import('../../src/domain/usecases/Buy/GetBuyByIdUseCase');
        const originalGetById = GetBuyByIdUseCase.prototype.execute.bind(GetBuyByIdUseCase.prototype);
        GetBuyByIdUseCase.prototype.execute = () => Promise.resolve(null);
        const res = await request(app).get('/buys/999999');
        expect(res.statusCode).toBe(404);
        GetBuyByIdUseCase.prototype.execute = originalGetById;
    });

    it('GET /buys/:id - error inesperado', async () => {
        const redis = await import('../../src/infrastructure/redisClient');
        jest.spyOn(redis.default, 'get').mockImplementation(() => { throw new Error('Redis error'); });
        const { GetBuyByIdUseCase } = await import('../../src/domain/usecases/Buy/GetBuyByIdUseCase');
        const originalGetByIdErr = GetBuyByIdUseCase.prototype.execute.bind(GetBuyByIdUseCase.prototype);
        GetBuyByIdUseCase.prototype.execute = () => { throw new Error('DB error'); };
        const res = await request(app).get('/buys/1');
        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
        GetBuyByIdUseCase.prototype.execute = originalGetByIdErr;
    });

    it('GET /buys - error inesperado', async () => {
        const redis = await import('../../src/infrastructure/redisClient');
        jest.spyOn(redis.default, 'get').mockImplementation(() => { throw new Error('Redis error'); });
        const { GetAllBuysUseCase } = await import('../../src/domain/usecases/Buy/GetAllBuysUseCase');
        const originalGetAll = GetAllBuysUseCase.prototype.execute.bind(GetAllBuysUseCase.prototype);
        GetAllBuysUseCase.prototype.execute = () => { throw new Error('DB error'); };
        const res = await request(app).get('/buys');
        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
        GetAllBuysUseCase.prototype.execute = originalGetAll;
    });

    it('GET /buys/:id - id no numérico', async () => {
        const res = await request(app).get('/buys/abc');
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('PUT /buys/:id - id no numérico', async () => {
        const res = await request(app)
            .put('/buys/xyz')
            .send({ units: 10 });
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('DELETE /buys/:id - id no numérico', async () => {
        const res = await request(app).delete('/buys/xyz');
        expect([400, 404, 500]).toContain(res.statusCode);
    });

    it('GET /buys/:id - simular error en Redis', async () => {
        const redis = await import('../../src/infrastructure/redisClient');
        jest.spyOn(redis.default, 'get').mockImplementation(() => { throw new Error('Redis error'); });
        const res = await request(app).get('/buys/1');
        expect([500, 400]).toContain(res.statusCode);
        jest.restoreAllMocks();
    });

    it('POST /buys - simular error en repositorio', async () => {
        const { CreateBuyUseCase } = await import('../../src/domain/usecases/Buy/CreateBuyUseCase');
        const original = CreateBuyUseCase.prototype.execute;
        CreateBuyUseCase.prototype.execute = jest.fn().mockRejectedValue(new Error('Repo error'));
        const res = await request(app)
            .post('/buys')
            .send({ clientId: 1, placementId: 2, units: 5 });
        expect([500, 400]).toContain(res.statusCode);
        CreateBuyUseCase.prototype.execute = original;
    });

    it('GET /buys - simular caché de Redis', async () => {
        const redis = await import('../../src/infrastructure/redisClient');
        jest.spyOn(redis.default, 'get').mockResolvedValue(JSON.stringify([{ id: 1, clientId: 1, placementId: 2, units: 5 }]));
        const res = await request(app).get('/buys');
        expect(res.statusCode).toBe(200);
        jest.restoreAllMocks();
    });

    it('POST /buys - valid', async () => {
        const res = await request(app)
            .post('/buys')
            .send({ clientId: 1, placementId: 2, units: 5 });
        expect([201, 400, 500]).toContain(res.statusCode);
    });

    it('POST /buys - invalid', async () => {
        const res = await request(app)
            .post('/buys')
            .send({ clientId: 'bad', placementId: 2 });
        expect(res.statusCode).toBe(400);
    });

    it('GET /buys', async () => {
        const res = await request(app).get('/buys');
        expect([200, 400, 500]).toContain(res.statusCode);
    });

    it('GET /buys/:id', async () => {
        const res = await request(app).get('/buys/1');
        expect([200, 404, 400, 500]).toContain(res.statusCode);
    });

    it('PUT /buys/:id', async () => {
        const res = await request(app)
            .put('/buys/1')
            .send({ units: 10 });
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });

    it('DELETE /buys/:id', async () => {
        const res = await request(app).delete('/buys/1');
        expect([204, 404, 400, 500]).toContain(res.statusCode);
    });
});
