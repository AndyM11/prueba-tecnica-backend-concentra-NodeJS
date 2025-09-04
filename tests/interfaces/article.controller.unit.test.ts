import * as controller from '../../src/interfaces/controllers/article.controller';
import { Request, Response } from 'express';

describe('Article Controller (unit)', () => {
    // Pruebas para la función createArticle
    describe('createArticle', () => {
        // Debe devolver 400 si el body es inválido (por ejemplo, barcode vacío)
        it('should return 400 if body is invalid', async () => {
            const req = { body: { barcode: '' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            await controller.createArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos inválidos' }));
        });
        // Debe devolver 201 si el body es válido y el artículo se crea correctamente
        it('should return 201 if body is valid', async () => {
            const uniqueBarcode = `BAR${Date.now()}`;
            const req = { body: { barcode: uniqueBarcode, manufacturerId: 1 } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            // Simula que el usecase retorna el artículo creado
            jest.spyOn(controller.createArticleUseCase, 'execute').mockResolvedValue({ id: 1, barcode: uniqueBarcode, manufacturerId: 1, stock: 0 });
            await controller.createArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, barcode: uniqueBarcode, manufacturerId: 1, stock: 0 });
        });
    });

    // Pruebas para la función getArticleById
    describe('getArticleById', () => {
        // Debe devolver 400 si el id recibido no es válido (no es numérico)
        it('should return 400 if id is invalid', async () => {
            const req = { params: { id: 'abc' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            await controller.getArticleById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        // Debe devolver 404 si el artículo no existe en la base de datos
        it('should return 404 if not found', async () => {
            const req = { params: { id: '99' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            // Simula que el usecase retorna null (no encontrado)
            jest.spyOn(controller.getArticleByIdUseCase, 'execute').mockResolvedValue(null);
            await controller.getArticleById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Artículo no encontrado' }));
        });
    });
});
