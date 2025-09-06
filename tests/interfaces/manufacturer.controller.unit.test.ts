import { Request, Response } from 'express';
import * as controller from '../../src/interfaces/controllers/manufacturer.controller';
import { deleteManufacturerUseCase, updateManufacturerUseCase } from '../../src/interfaces/controllers/manufacturer.controller';

// Mock minimal de Response para Express
class MockResponse {
    status = jest.fn().mockImplementation(() => this);
    json = jest.fn().mockImplementation(() => this);
    send = jest.fn().mockImplementation(() => this);
}

const getMockReq = (custom: Partial<Request> = {}): Request => ({
    ...custom,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    is: jest.fn(),
} as unknown as Request);

describe('manufacturer.controller unit', () => {
    afterEach(() => jest.restoreAllMocks());

    describe('createManufacturer', () => {
        it('returns 400 if body is invalid', async () => {
            const req = getMockReq({ body: { name: '' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            await controller.createManufacturer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });

        it('returns 201 if body is valid', async () => {
            const req = getMockReq({ body: { name: 'Fabricante X' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            const mockExecute = jest.spyOn(controller.createManufacturerUseCase, 'execute').mockResolvedValue({ id: 1, name: 'Fabricante X' });
            await controller.createManufacturer(req, res, next);
            expect(mockExecute).toHaveBeenCalledWith({ name: 'Fabricante X' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Fabricante X' });
        });

        it('calls next on unexpected error', async () => {
            const req = getMockReq({ body: { name: 'Fabricante X' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            jest.spyOn(controller.createManufacturerUseCase, 'execute').mockRejectedValue(new Error('Test error'));
            await controller.createManufacturer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('updateManufacturer', () => {
        it('returns 400 if id is invalid', async () => {
            const req = getMockReq({ params: { id: 'abc' }, body: { name: 'Nuevo' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            await controller.updateManufacturer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('returns 400 if body is invalid', async () => {
            const req = getMockReq({ params: { id: '1' }, body: { name: '' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            await controller.updateManufacturer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('calls next on unexpected error', async () => {
            const req = getMockReq({ params: { id: '1' }, body: { name: 'Nuevo' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            jest.spyOn(updateManufacturerUseCase, 'execute').mockRejectedValue(new Error('Test error'));
            await controller.updateManufacturer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteManufacturer', () => {
        it('returns 400 if id is invalid', async () => {
            const req = getMockReq({ params: { id: 'abc' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            await controller.deleteManufacturer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
        it('calls next on unexpected error', async () => {
            const req = getMockReq({ params: { id: '1' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            jest.spyOn(deleteManufacturerUseCase, 'execute').mockRejectedValue(new Error('Test error'));
            await controller.deleteManufacturer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
        it('returns 204 on success', async () => {
            const req = getMockReq({ params: { id: '1' } });
            const res = new MockResponse() as unknown as Response;
            const next = jest.fn();
            jest.spyOn(deleteManufacturerUseCase, 'execute').mockResolvedValue(undefined);
            await controller.deleteManufacturer(req, res, next);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });
    });
});
