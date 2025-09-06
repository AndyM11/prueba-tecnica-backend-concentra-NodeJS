import * as controller from '../../src/interfaces/controllers/placement.controller';

describe('Placement Controller (unit)', () => {
    describe('createPlacement', () => {
        it('should return 400 if body is invalid', async () => {
            const req = { body: { displayName: '', price: -1 } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            await controller.createPlacement(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos inválidos' }));
        });
        it('should return 201 if body is valid', async () => {
            const req = { body: { articleId: 1, locationId: 1, displayName: 'Test', price: 10 } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            const next = jest.fn();
            jest.spyOn(controller.createPlacementUseCase, 'execute').mockResolvedValue({ id: 1, articleId: 1, locationId: 1, displayName: 'Test', price: 10 });
            await controller.createPlacement(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, articleId: 1, locationId: 1, displayName: 'Test', price: 10 });
        });
    });

    describe('getPlacementById', () => {
        it('should return 400 if id is invalid', async () => {
            const req = { params: { id: 'abc' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            await controller.getPlacementById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it('should return 404 if not found', async () => {
            const req = { params: { id: '99' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            jest.spyOn(controller.getPlacementByIdUseCase, 'execute').mockResolvedValue(null);
            await controller.getPlacementById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
