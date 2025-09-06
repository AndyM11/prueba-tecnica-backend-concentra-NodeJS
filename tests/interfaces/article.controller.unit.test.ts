
import * as controller from '../../src/interfaces/controllers/article.controller';
import { Request, Response, NextFunction } from 'express';

function mockReq(body: object = {}, params: object = {}): Request {
    return { body, params } as unknown as Request;
}

function mockRes(): Response {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
}

describe('Article Controller (unit)', () => {
    describe('createArticle', () => {
        it('debe devolver 400 si el body es inválido', async () => {
            const req = mockReq({ barcode: '' });
            const res = mockRes();
            const next: NextFunction = jest.fn();
            await controller.createArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('debe devolver 201 si el body es válido', async () => {
            const uniqueBarcode = `BAR${Date.now()}`;
            const req = mockReq({ barcode: uniqueBarcode, manufacturerId: 1 });
            const res = mockRes();
            const next: NextFunction = jest.fn();
            jest.spyOn(controller.createArticleUseCase, 'execute').mockResolvedValue({ id: 1, barcode: uniqueBarcode, manufacturerId: 1, stock: 0 });
            await controller.createArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, barcode: uniqueBarcode, manufacturerId: 1, stock: 0 });
        });
    });

    describe('getArticleById', () => {
        it('debe devolver 400 si el id es inválido', async () => {
            const req = mockReq({}, { id: 'abc' });
            const res = mockRes();
            await controller.getArticleById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('debe devolver 404 si el artículo no existe', async () => {
            const req = mockReq({}, { id: '99' });
            const res = mockRes();
            jest.spyOn(controller.getArticleByIdUseCase, 'execute').mockResolvedValue(null);
            await controller.getArticleById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });
});
