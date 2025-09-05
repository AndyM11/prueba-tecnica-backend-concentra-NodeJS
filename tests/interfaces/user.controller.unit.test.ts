import * as controller from '../../src/interfaces/controllers/user.controller';
import { Request, Response } from 'express';

describe('User Controller', () => {
    const mockReq = (body = {}, params = {}) => ({ body, params } as unknown as Request);
    const mockRes = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    it('debe retornar error si datos inválidos al crear', async () => {
        const req = mockReq({ username: '', password: '', rol: 'USER' });
        const res = mockRes();
        await controller.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debe retornar error si datos inválidos al actualizar', async () => {
        const req = mockReq({ username: '' }, { id: 1 });
        const res = mockRes();
        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
