import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { PlacementFilterOptions } from "../../domain/entities/Types";
import { CreatePlacementUseCase } from "../../domain/usecases/Placement/CreatePlacementUseCase";
import { DeletePlacementUseCase } from "../../domain/usecases/Placement/DeletePlacementUseCase";
import { GetAllPlacementsUseCase } from "../../domain/usecases/Placement/GetAllPlacementsUseCase";
import { GetPlacementByIdUseCase } from "../../domain/usecases/Placement/GetPlacementByIdUseCase";
import { UpdatePlacementUseCase } from "../../domain/usecases/Placement/UpdatePlacementUseCase";
import redis from "../../infrastructure/redisClient";
import { PrismaPlacementRepository } from "../../infrastructure/repositories/PrismaPlacementRepository";

const placementRepo = new PrismaPlacementRepository();
export const getAllPlacementsUseCase = new GetAllPlacementsUseCase(
  placementRepo,
);
export const createPlacementUseCase = new CreatePlacementUseCase(placementRepo);
export const getPlacementByIdUseCase = new GetPlacementByIdUseCase(
  placementRepo,
);
export const updatePlacementUseCase = new UpdatePlacementUseCase(placementRepo);
export const deletePlacementUseCase = new DeletePlacementUseCase(placementRepo);

const placementSchema = z.object({
  articleId: z.number(),
  locationId: z.number(),
  displayName: z.string().min(3, "Display name is required"),
  price: z.number().min(1, "Price must be at least 1"),
});

export const createPlacement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parse = placementSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const placement = await createPlacementUseCase.execute(parse.data);
    res.status(201).json(placement);
  } catch (error: unknown) {
    next(error);
  }
};

export const getPlacements = async (req: Request, res: Response) => {
  try {
    const { articleId, locationId, displayName, price, page, per_page } = req.query;
    const options: PlacementFilterOptions = {};
    if (typeof articleId === "string") options.articleId = Number(articleId);
    if (typeof locationId === "string") options.locationId = Number(locationId);
    if (typeof displayName === "string") options.displayName = String(displayName);
    if (typeof price === "string") options.price = Number(price);
    if (typeof page === "string") options.page = Number(page);
    if (typeof per_page === "string") options.per_page = Number(per_page);

    const cacheKey = `placements:all:${JSON.stringify(options)}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await getAllPlacementsUseCase.execute(
      Object.keys(options).length ? options : undefined,
    );
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error obteniendo colocaciones",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const getPlacementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de colocación inválido" });
    }
    const cacheKey = `placements:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const placement = await getPlacementByIdUseCase.execute(Number(id));
    if (!placement)
      return res.status(404).json({ error: "Colocación no encontrada" });
    await redis.set(cacheKey, JSON.stringify(placement), "EX", 60);
    res.json(placement);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error obteniendo colocación",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const updatePlacement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de colocación inválido" });
    }
    const parse = placementSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: parse.error.issues });
    }
    const placement = await updatePlacementUseCase.execute(
      Number(id),
      parse.data,
    );
    res.json(placement);
  } catch (error: unknown) {
    next(error);
  }
};

export const deletePlacement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de colocación inválido" });
    }
    await deletePlacementUseCase.execute(Number(id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
