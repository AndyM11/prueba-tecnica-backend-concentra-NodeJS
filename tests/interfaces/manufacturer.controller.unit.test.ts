import * as controller from '../../src/interfaces/controllers/manufacturer.controller';
import { Request, Response } from 'express';

describe('createManufacturer (unit)', () => {
    // Limpia los mocks después de cada prueba
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Prueba: body inválido (name vacío)
    it('should return 400 if body is invalid', async () => {
        const req = { body: { name: '' } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
        await controller.createManufacturer(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos inválidos' }));
    });

    // Prueba: body válido (crea fabricante correctamente)
    it('should return 201 if body is valid', async () => {
        const req = { body: { name: 'Fabricante X' } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
        const mockExecute = jest.spyOn(controller.createManufacturerUseCase, 'execute').mockResolvedValue({ id: 1, name: 'Fabricante X' });
        await controller.createManufacturer(req, res, next);
        expect(mockExecute).toHaveBeenCalledWith({ name: 'Fabricante X' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Fabricante X' });
    });
});
