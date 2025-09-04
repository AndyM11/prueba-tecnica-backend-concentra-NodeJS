import { errorHandler } from '../../src/infrastructure/middleware/errorHandler';

// Mock de objetos Request, Response y NextFunction
const req = {} as any;
const next = jest.fn();

describe('errorHandler middleware', () => {
    it('debe devolver 409 para BARCODE_DUPLICATE', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { type: 'BARCODE_DUPLICATE' };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'El código de barras ya existe' });
    });

    it('debe devolver 400 para MANUFACTURER_NOT_FOUND', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { type: 'MANUFACTURER_NOT_FOUND' };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'El fabricante no existe' });
    });

    it('debe devolver 409 para P2002 (duplicado)', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { code: 'P2002', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Registro duplicado', details: err.meta });
    });

    it('debe devolver 404 para P2025 (no encontrado)', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { code: 'P2025', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Registro no encontrado', details: err.meta });
    });

    it('debe devolver 400 para P2003 (clave foránea)', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { code: 'P2003', meta: { modelName: 'Articulo' } };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Violación de restricción de clave foránea: el fabricante no existe o es inválido', details: err.meta });
    });

    it('debe devolver 500 para error genérico', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const err = { message: 'Error interno' };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno', details: err });
    });
});
