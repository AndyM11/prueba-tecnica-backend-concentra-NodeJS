import request from 'supertest';
import app from '../../src/app';

describe('User Controller Integration', () => {
    it('debe rechazar creación de usuario con datos inválidos', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({ username: '', password: '', rol: 'USER' });
        expect(res.status).toBe(400);
    });

    it('debe rechazar actualización de usuario con datos inválidos', async () => {
        const res = await request(app)
            .put('/api/v1/user/1')
            .send({ username: '' });
        expect(res.status).toBe(400);
    });
});
