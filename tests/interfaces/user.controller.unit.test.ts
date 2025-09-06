import { NextFunction, Request, Response } from 'express';
import * as controller from '../../src/interfaces/controllers/user.controller';


function mockReq(body: Record<string, unknown> = {}, params: Record<string, unknown> = {}): Request {
    return {
        body,
        params,
    } as unknown as Request;
}

function mockRes(): Response {
    const res = {
        status: jest.fn((_code: number) => res),
        json: jest.fn((_body?: unknown) => res)
    } as unknown as Response;
    return res;
}

describe('User Controller', () => {
    it('debe retornar error 400 si datos inválidos al crear', async () => {
        const req = mockReq({ username: '', password: '', rol: 'USER' });
        const res = mockRes();
        const next: NextFunction = jest.fn();
        await controller.createUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe retornar error 400 si datos inválidos al actualizar', async () => {
        const req = mockReq({ username: '' }, { id: 1 });
        const res = mockRes();
        const next: NextFunction = jest.fn();
        await controller.updateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe retornar error 400 si el id no es numérico al buscar por id', async () => {
        const req = mockReq({}, { id: 'abc' });
        const res = mockRes();
        await controller.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('debe retornar error 400 si el id no es numérico al actualizar', async () => {
        const req = mockReq({ username: 'test' }, { id: 'abc' });
        const res = mockRes();
        const next: NextFunction = jest.fn();
        await controller.updateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
});
