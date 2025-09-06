import { NextFunction, Request, Response } from 'express';
import * as controller from '../../src/interfaces/controllers/user.controller';
import redis from '../../src/infrastructure/redisClient';


function mockReq(body: Record<string, unknown> = {}, params: Record<string, unknown> = {}): Request {
    return {
        body,
        params,
    } as unknown as Request;
}

// Tipo auxiliar para exponer los mocks y evitar errores de tipado
export type MockedResponse = Response & {
    status: jest.Mock<any, any>;
    json: jest.Mock<any, any>;
};

function mockRes(): MockedResponse {
    const res = {} as MockedResponse;
    res.status = jest.fn((_code?: number) => res);
    res.json = jest.fn((_body?: unknown) => res);
    return res;
}

describe('User Controller - success and not found cases', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a user and return 201', async () => {
        const user = { id: 1, username: 'user', rol: 'user' };
        const original = controller.createUserUseCase;
        (controller as any).createUserUseCase = { execute: jest.fn().mockResolvedValue(user) };
        const req = mockReq({ username: 'user', password: 'Password123!', rol: 'user' });
        const res = mockRes();
        const next = jest.fn();
        await controller.createUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
        (controller as any).createUserUseCase = original;
    });

    it('should get user by id and return 200', async () => {
        const user = { id: 1, username: 'user', rol: 'user' };
        const original = controller.getUserByIdUseCase;
        (controller as any).getUserByIdUseCase = { execute: jest.fn().mockResolvedValue(user) };
        jest.spyOn(redis, 'get').mockResolvedValueOnce(null);
        jest.spyOn(redis, 'set').mockResolvedValueOnce('OK');
        const req = mockReq({}, { id: 1 });
        const res = mockRes();
        await controller.getUserById(req, res);
        expect(res.json).toHaveBeenCalledWith(user);
        (controller as any).getUserByIdUseCase = original;
    });

    it('should return 404 if user by id not found', async () => {
        const original = controller.getUserByIdUseCase;
        (controller as any).getUserByIdUseCase = { execute: jest.fn().mockResolvedValue(null) };
        jest.spyOn(redis, 'get').mockResolvedValueOnce(null);
        const req = mockReq({}, { id: 999 });
        const res = mockRes();
        await controller.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario no encontrado' });
        (controller as any).getUserByIdUseCase = original;
    });

    it('should get user by username and return 200', async () => {
        const user = { id: 1, username: 'user', rol: 'user' };
        const original = controller.getUserByUsernameUseCase;
        (controller as any).getUserByUsernameUseCase = { execute: jest.fn().mockResolvedValue(user) };
        const req = mockReq({}, { username: 'user' });
        const res = mockRes();
        await controller.getUserByUsername(req, res);
        expect(res.json).toHaveBeenCalledWith(user);
        (controller as any).getUserByUsernameUseCase = original;
    });

    it('should return 404 if user by username not found', async () => {
        const original = controller.getUserByUsernameUseCase;
        (controller as any).getUserByUsernameUseCase = { execute: jest.fn().mockResolvedValue(null) };
        const req = mockReq({}, { username: 'notfound' });
        const res = mockRes();
        await controller.getUserByUsername(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario no encontrado' });
        (controller as any).getUserByUsernameUseCase = original;
    });

    it('should update user and return 200', async () => {
        const user = { id: 1, username: 'user', rol: 'user' };
        const original = controller.updateUserUseCase;
        (controller as any).updateUserUseCase = { execute: jest.fn().mockResolvedValue(user) };
        const req = mockReq({ username: 'user' }, { id: 1 });
        const res = mockRes();
        const next = jest.fn();
        await controller.updateUser(req, res, next);
        expect(res.json).toHaveBeenCalledWith(user);
        (controller as any).updateUserUseCase = original;
    });

    it('should return 404 if user to update not found', async () => {
        const original = controller.updateUserUseCase;
        (controller as any).updateUserUseCase = { execute: jest.fn().mockResolvedValue(null) };
        const req = mockReq({ username: 'user' }, { id: 999 });
        const res = mockRes();
        const next = jest.fn();
        await controller.updateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario no encontrado' });
        (controller as any).updateUserUseCase = original;
    });

    it('should delete user and return success message', async () => {
        const original = controller.deleteUserUseCase;
        (controller as any).deleteUserUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
        const req = mockReq({}, { id: 1 });
        const res = mockRes();
        const next = jest.fn();
        await controller.deleteUser(req, res, next);
        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario eliminado correctamente' });
        (controller as any).deleteUserUseCase = original;
    });
});

describe('User Controller', () => {
    it('debe retornar error 400 si datos inválidos al crear', async () => {
        const req = mockReq({ username: '', password: '', rol: 'USER' });
        const res = mockRes();
        const next: NextFunction = jest.fn();
        await controller.createUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        // Espera un array de issues de Zod
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
        const call = res.json.mock.calls[0][0];
        expect(call.error[0]).toHaveProperty('code');
        expect(call.error[0]).toHaveProperty('message');
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

describe('Cobertura de errores inesperados en User Controller', () => {
    it('getUserByUsername retorna 500 si falla el usecase', async () => {
        const original = controller.getUserByUsernameUseCase;
        (controller as any).getUserByUsernameUseCase = { execute: async () => { throw new Error('fail'); } };
        const req = { params: { username: 'user' } } as unknown as Request;
        const res = mockRes();
        await controller.getUserByUsername(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        (controller as any).getUserByUsernameUseCase = original;
    });

    it('getUsers retorna 500 si falla redis o usecase', async () => {
        const original = controller.getAllUsersUseCase;
        jest.spyOn(redis, 'get').mockRejectedValueOnce(new Error('fail'));
        (controller as any).getAllUsersUseCase = { execute: async () => { throw new Error('fail'); } };
        const req = {} as Request;
        const res = mockRes();
        await controller.getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        (controller as any).getAllUsersUseCase = original;
        jest.restoreAllMocks();
    });

    it('getUserById retorna 500 si falla redis o usecase', async () => {
        const original = controller.getUserByIdUseCase;
        jest.spyOn(redis, 'get').mockRejectedValueOnce(new Error('fail'));
        (controller as any).getUserByIdUseCase = { execute: async () => { throw new Error('fail'); } };
        const req = { params: { id: 1 } } as unknown as Request;
        const res = mockRes();
        await controller.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        (controller as any).getUserByIdUseCase = original;
        jest.restoreAllMocks();
    });

    it('createUser llama next en error inesperado', async () => {
        const original = controller.createUserUseCase;
        (controller as unknown as { createUserUseCase: { execute: (data: any) => Promise<any> } }).createUserUseCase = {
            execute: jest.fn(() => Promise.reject(new Error('fail')))
        };
        const req = mockReq({ username: 'usuarioValido', password: 'Password123!', rol: 'user' });
        const res = mockRes();
        const next = jest.fn();
        await controller.createUser(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        (controller as unknown as { createUserUseCase: any }).createUserUseCase = original;
    });

    it('updateUser llama next en error inesperado', async () => {
        const original = controller.updateUserUseCase;
        (controller as any).updateUserUseCase = { execute: async () => { throw new Error('fail'); } };
        const req = mockReq({ username: 'user' }, { id: 1 });
        const res = mockRes();
        const next = jest.fn();
        await controller.updateUser(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        (controller as any).updateUserUseCase = original;
    });

    it('deleteUser llama next en error inesperado', async () => {
        const original = controller.deleteUserUseCase;
        (controller as any).deleteUserUseCase = { execute: async () => { throw new Error('fail'); } };
        const req = mockReq({}, { id: 1 });
        const res = mockRes();
        const next = jest.fn();
        await controller.deleteUser(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        (controller as any).deleteUserUseCase = original;
    });
});
