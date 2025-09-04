import * as controller from '../../src/interfaces/controllers/placement.controller';
import { Request, Response } from 'express';

describe('Placement Controller (unit)', () => {
    describe('createPlacement', () => {
        it('debería devolver 400 si el body es inválido', async () => {
            const req = { body: { nombreExhibido: '', precio: -1 } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            await controller.createPlacement(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos inválidos' }));
        });
        it('debería devolver 201 si el body es válido', async () => {
            const req = { body: { articuloId: 1, ubicacionId: 1, nombreExhibido: 'Test', precio: 10 } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            jest.spyOn(controller.createPlacementUseCase, 'execute').mockResolvedValue({ id: 1, articuloId: 1, ubicacionId: 1, nombreExhibido: 'Test', precio: 10 });
            await controller.createPlacement(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, articuloId: 1, ubicacionId: 1, nombreExhibido: 'Test', precio: 10 });
        });
    });

    describe('getPlacementById', () => {
        it('debería devolver 400 si el id es inválido', async () => {
            const req = { params: { id: 'abc' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            await controller.getPlacementById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('debería devolver 404 si no se encuentra', async () => {
            const req = { params: { id: '99' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            jest.spyOn(controller.getPlacementByIdUseCase, 'execute').mockResolvedValue(null);
            await controller.getPlacementById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
