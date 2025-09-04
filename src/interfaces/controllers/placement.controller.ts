import { PrismaPlacementRepository } from '../../infrastructure/repositories/PrismaPlacementRepository';
import { GetAllPlacementsUseCase } from '../../domain/usecases/Placement/GetAllPlacementsUseCase';
import { CreatePlacementUseCase } from '../../domain/usecases/Placement/CreatePlacementUseCase';
import { GetPlacementByIdUseCase } from '../../domain/usecases/Placement/GetPlacementByIdUseCase';
import { UpdatePlacementUseCase } from '../../domain/usecases/Placement/UpdatePlacementUseCase';
import { DeletePlacementUseCase } from '../../domain/usecases/Placement/DeletePlacementUseCase';
import { Request, Response } from 'express';
import { z } from 'zod';

const placementRepo = new PrismaPlacementRepository();
export const getAllPlacementsUseCase = new GetAllPlacementsUseCase(placementRepo);
export const createPlacementUseCase = new CreatePlacementUseCase(placementRepo);
export const getPlacementByIdUseCase = new GetPlacementByIdUseCase(placementRepo);
export const updatePlacementUseCase = new UpdatePlacementUseCase(placementRepo);
export const deletePlacementUseCase = new DeletePlacementUseCase(placementRepo);

const placementSchema = z.object({
    articleId: z.number(),
    locationId: z.number(),
    displayName: z.string().min(3, 'Display name is required'),
    price: z.number().min(1, 'Price must be at least 1')
});

export const getPlacements = async (req: Request, res: Response) => {
    try {
        const { articleId, locationId, displayName, price, page, per_page } = req.query;
        const options: any = {};
        if (articleId) options.articleId = Number(articleId);
        if (locationId) options.locationId = Number(locationId);
        if (displayName) options.displayName = String(displayName);
        if (price) options.price = Number(price);
        if (page) options.page = Number(page);
        if (per_page) options.per_page = Number(per_page);
        const result = await getAllPlacementsUseCase.execute(Object.keys(options).length ? options : undefined);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo colocaciones', details: error instanceof Error ? error.message : error });
    }
};

export const createPlacement = async (req: Request, res: Response, next: Function) => {
    try {
        const parse = placementSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        const placement = await createPlacementUseCase.execute(parse.data);
        res.status(201).json(placement);
    } catch (error: any) {
        next(error);
    }
};

export const getPlacementById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID de colocación inválido' });
        }
        const placement = await getPlacementByIdUseCase.execute(Number(id));
        if (!placement) return res.status(404).json({ error: 'Colocación no encontrada' });
        res.json(placement);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo colocación', details: error instanceof Error ? error.message : error });
    }
};

export const updatePlacement = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID de colocación inválido' });
        }
        const parse = placementSchema.partial().safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: 'Datos inválidos', details: parse.error.issues });
        }
        const placement = await updatePlacementUseCase.execute(Number(id), parse.data);
        res.json(placement);
    } catch (error: any) {
        next(error);
    }
};

export const deletePlacement = async (req: Request, res: Response, next: Function) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID de colocación inválido' });
        }
        await deletePlacementUseCase.execute(Number(id));
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};
