import * as controller from '../../src/interfaces/controllers/user.controller';
import { Request, Response } from 'express';
import { User } from '../../src/domain/entities/User';
import { UserRole } from '../../src/domain/entities/Types';

describe('User Controller - getUserByUsername', () => {
    const mockReq = (params = {}) => ({ params } as unknown as Request);
    const mockRes = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    it('debe retornar 404 si no existe', async () => {
        const original = controller.getUserByUsernameUseCase;
        (controller as any).getUserByUsernameUseCase = { execute: async () => null };
        const req = mockReq({ username: 'noexiste' });
        const res = mockRes();
        await controller.getUserByUsername(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        (controller as any).getUserByUsernameUseCase = original;
    });

    it('debe retornar el usuario si existe', async () => {
        const user = new User(1, 'user', 'hash', UserRole.USER, null);
        const original = controller.getUserByUsernameUseCase;
        (controller as any).getUserByUsernameUseCase = { execute: async () => user };
        const req = mockReq({ username: 'user' });
        const res = mockRes();
        await controller.getUserByUsername(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'user' }));
        (controller as any).getUserByUsernameUseCase = original;
    });
});
