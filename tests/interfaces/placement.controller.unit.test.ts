
jest.mock('../../src/infrastructure/redisClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

import { Request, Response } from 'express';
import redis from '../../src/infrastructure/redisClient';
import * as controller from '../../src/interfaces/controllers/placement.controller';

describe('Placement Controller (unit)', () => {
    describe('createPlacement', () => {
        it('should return 400 if body is invalid', async () => {
            const req: Partial<Request> = { body: { displayName: '', price: -1 } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            await controller.createPlacement(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos inválidos' }));
        });
        it('should return 201 if body is valid', async () => {
            const req: Partial<Request> = { body: { articleId: 1, locationId: 1, displayName: 'Test', price: 10 } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            jest.spyOn(controller.createPlacementUseCase, 'execute').mockResolvedValue({ id: 1, articleId: 1, locationId: 1, displayName: 'Test', price: 10 });
            await controller.createPlacement(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, articleId: 1, locationId: 1, displayName: 'Test', price: 10 });
        });
        it('should call next on unexpected error', async () => {
            const req: Partial<Request> = { body: { articleId: 1, locationId: 1, displayName: 'Test', price: 10 } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            jest.spyOn(controller.createPlacementUseCase, 'execute').mockRejectedValue(new Error('fail'));
            await controller.createPlacement(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getPlacementById', () => {
        it('should return 400 if id is invalid', async () => {
            const req: Partial<Request> = { params: { id: 'abc' } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await controller.getPlacementById(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('should return 404 if not found', async () => {
            const req: Partial<Request> = { params: { id: '99' } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            jest.spyOn(controller.getPlacementByIdUseCase, 'execute').mockResolvedValue(null);
            await controller.getPlacementById(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it('should return 500 on unexpected error', async () => {
            const req: Partial<Request> = { params: { id: '1' } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            jest.spyOn(controller.getPlacementByIdUseCase, 'execute').mockImplementation(() => { throw new Error('fail'); });
            await controller.getPlacementById(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });

    describe('updatePlacement', () => {
        it('should return 400 if id is invalid', async () => {
            const req: Partial<Request> = { params: { id: 'abc' }, body: {} };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            await controller.updatePlacement(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('should return 400 if body is invalid', async () => {
            const req: Partial<Request> = { params: { id: '1' }, body: { price: 0 } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            await controller.updatePlacement(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('should call next on unexpected error', async () => {
            const req: Partial<Request> = { params: { id: '1' }, body: { price: 10 } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            jest.spyOn(controller.updatePlacementUseCase, 'execute').mockRejectedValue(new Error('fail'));
            await controller.updatePlacement(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deletePlacement', () => {
        it('should return 400 if id is invalid', async () => {
            const req: Partial<Request> = { params: { id: 'abc' } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            await controller.deletePlacement(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('should call next on unexpected error', async () => {
            const req: Partial<Request> = { params: { id: '1' } };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            jest.spyOn(controller.deletePlacementUseCase, 'execute').mockRejectedValue(new Error('fail'));
            await controller.deletePlacement(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getPlacements', () => {
        it('should return 500 on unexpected error', async () => {
            const req: Partial<Request> = { query: {} };
            const res: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            (redis.get as jest.Mock).mockResolvedValue(null); // Evita que el error venga de redis
            jest.spyOn(controller.getAllPlacementsUseCase, 'execute').mockRejectedValue(new Error('fail'));
            await controller.getPlacements(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });
});
