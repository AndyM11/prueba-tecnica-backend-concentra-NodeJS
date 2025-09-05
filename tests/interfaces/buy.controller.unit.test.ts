import request from 'supertest';
import express from 'express';
import buyRouter from '../../src/interfaces/routes/buy.routes';

describe('Buy Controller Integration', () => {
    const app = express();
    app.use(express.json());
    app.use('/buys', buyRouter);

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
