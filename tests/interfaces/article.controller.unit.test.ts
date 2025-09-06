import redis from '../../src/infrastructure/redisClient';

import { NextFunction, Request, Response } from 'express';
import * as controller from '../../src/interfaces/controllers/article.controller';

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
    describe('getArticles', () => {
        it('debe devolver datos desde cache si existe', async () => {
            const req = { query: {} } as unknown as Request;
            const res = mockRes();
            const cached = JSON.stringify([{ id: 1, barcode: 'CACHED', manufacturerId: 1 }]);
            jest.spyOn(redis, 'get').mockResolvedValueOnce(cached);
            await controller.getArticles(req, res);
            expect(res.json).toHaveBeenCalledWith(JSON.parse(cached));
        });
        it('debe devolver 500 si ocurre un error inesperado', async () => {
            const req = { query: {} } as unknown as Request;
            const res = mockRes();
            jest.spyOn(redis, 'get').mockImplementationOnce(() => { throw new Error('Test error'); });
            await controller.getArticles(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });

    describe('getArticleById', () => {
        it('debe devolver datos desde cache si existe', async () => {
            const req = mockReq({}, { id: '1' });
            const res = mockRes();
            const cached = JSON.stringify({ id: 1, barcode: 'CACHED', manufacturerId: 1 });
            jest.spyOn(redis, 'get').mockResolvedValueOnce(cached);
            await controller.getArticleById(req, res);
            expect(res.json).toHaveBeenCalledWith(JSON.parse(cached));
        });
        it('debe devolver 500 si ocurre un error inesperado', async () => {
            const req = mockReq({}, { id: '1' });
            const res = mockRes();
            jest.spyOn(redis, 'get').mockImplementationOnce(() => { throw new Error('Test error'); });
            await controller.getArticleById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });

    describe('updateArticle', () => {
        it('debe devolver 400 si el id es inválido', async () => {
            const req = mockReq({ barcode: '12345', manufacturerId: 1 }, { id: 'abc' });
            const res = mockRes();
            const next = jest.fn();
            await controller.updateArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('debe devolver 400 si el body es inválido', async () => {
            const req = mockReq({ barcode: '' }, { id: '1' });
            const res = mockRes();
            const next = jest.fn();
            await controller.updateArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('debe llamar next en error inesperado', async () => {
            const req = mockReq({ barcode: '12345', manufacturerId: 1 }, { id: '1' });
            const res = mockRes();
            const next = jest.fn();
            jest.spyOn(controller.updateArticleUseCase, 'execute').mockImplementationOnce(() => { throw new Error('Test error'); });
            await controller.updateArticle(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteArticle', () => {
        it('debe devolver 400 si el id es inválido', async () => {
            const req = mockReq({}, { id: 'abc' });
            const res = mockRes();
            const next = jest.fn();
            await controller.deleteArticle(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('debe llamar next en error inesperado', async () => {
            const req = mockReq({}, { id: '1' });
            const res = mockRes();
            const next = jest.fn();
            jest.spyOn(controller.deleteArticleUseCase, 'execute').mockImplementationOnce(() => { throw new Error('Test error'); });
            await controller.deleteArticle(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
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
