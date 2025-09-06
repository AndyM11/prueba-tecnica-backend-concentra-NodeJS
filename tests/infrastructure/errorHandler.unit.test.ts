import { errorHandler } from '../../src/infrastructure/middleware/errorHandler';


import type { Request, Response, NextFunction } from 'express';

const req = {} as Request;
const next: NextFunction = jest.fn();

type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
};

function mockRes(): Partial<Response> & MockResponse {
    const res: Partial<Response> & MockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    return res;
}

describe('errorHandler middleware', () => {
    it('debe devolver 409 para BARCODE_DUPLICATE', () => {
        const res = mockRes();
        const err = { type: 'BARCODE_DUPLICATE' };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'El código de barras ya existe' });
    });

    it('debe devolver 400 para MANUFACTURER_NOT_FOUND', () => {
        const res = mockRes();
        const err = { type: 'MANUFACTURER_NOT_FOUND' };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'El fabricante no existe' });
    });

    it('debe devolver 409 para P2002 (duplicado)', () => {
        const res = mockRes();
        const err = { code: 'P2002', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Registro duplicado', details: err.meta });
    });

    it('debe devolver 404 para P2025 (no encontrado)', () => {
        const res = mockRes();
        const err = { code: 'P2025', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Registro no encontrado', details: err.meta });
    });

    it('debe devolver 400 para P2003 (clave foránea)', () => {
        const res = mockRes();
        const err = { code: 'P2003', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Violación de restricción de clave foránea: el fabricante no existe o es inválido', details: err.meta });
    });

    it('debe devolver 500 para error genérico', () => {
        const res = mockRes();
        const err = { message: 'Error interno' };
        errorHandler(err, req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});
